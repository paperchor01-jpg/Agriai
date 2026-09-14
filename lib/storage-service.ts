/**
 * AgriAI Storage & Image Security Service
 * 
 * Secure upload pipeline for agricultural inspection images:
 * - Binary magic byte verification (JPEG, PNG, WEBP)
 * - 10MB size ceiling enforcement
 * - Safe UUID file naming (prevents path traversal)
 * - EXIF privacy metadata stripping
 * - Supabase Storage bucket integration
 */

import { getSupabaseClient } from './supabase/client';
import { logger } from './logger';
import crypto from 'crypto';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const BUCKET_NAME = 'crop-images';

export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
  mimeType: string;
}

/**
 * Validates binary magic bytes for JPEG, PNG, and WEBP.
 */
export function verifyImageMagicBytes(buffer: Buffer): { valid: boolean; detectedMime?: string } {
  if (buffer.length < 12) return { valid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedMime: 'image/png' };
  }

  // WEBP: RIFF at 0..3 and WEBP at 8..11
  const isRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
  const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  if (isRiff && isWebp) {
    return { valid: true, detectedMime: 'image/webp' };
  }

  return { valid: false };
}

/**
 * Strips EXIF metadata segments from JPEG buffers to prevent farmer privacy / GPS leaks.
 */
export function stripExifMetadata(buffer: Buffer, mimeType: string): Buffer {
  if (mimeType !== 'image/jpeg') {
    return buffer; // For PNG/WEBP, raw buffer without App1 marker
  }

  try {
    // If standard JPEG, skip APP1/APP2 markers (Exif/XMP)
    let offset = 2; // skip SOI (FF D8)
    const chunks: Buffer[] = [buffer.subarray(0, 2)];

    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];

      // SOS (Start of Scan) - rest of file is compressed entropy data
      if (marker === 0xda) {
        chunks.push(buffer.subarray(offset));
        break;
      }

      // RST markers or standalone
      if (marker === 0xd8 || marker === 0xd9) {
        chunks.push(buffer.subarray(offset, offset + 2));
        offset += 2;
        continue;
      }

      const length = buffer.readUInt16BE(offset + 2);
      // APP1 (Exif) is 0xE1; APP2 is 0xE2
      if (marker === 0xe1 || marker === 0xe2) {
        // Skip Exif chunk to strip private metadata
        offset += 2 + length;
      } else {
        chunks.push(buffer.subarray(offset, offset + 2 + length));
        offset += 2 + length;
      }
    }

    return Buffer.concat(chunks);
  } catch {
    return buffer; // Fallback to original if stream parse fails
  }
}

/**
 * Securely uploads an inspection image to Supabase Storage.
 */
export async function uploadInspectionImage(
  fileBuffer: Buffer,
  declaredMimeType: string,
  userId: string = '00000000-0000-0000-0000-000000000001'
): Promise<UploadResult> {
  // 1. Size constraint
  if (fileBuffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`File size ${(fileBuffer.length / (1024 * 1024)).toFixed(1)}MB exceeds maximum 10MB`);
  }

  // 2. Binary signature check
  const { valid, detectedMime } = verifyImageMagicBytes(fileBuffer);
  if (!valid || !detectedMime) {
    throw new Error('Invalid or corrupted image format. Binary header verification failed.');
  }

  // 3. Strip EXIF GPS metadata
  const sanitizedBuffer = stripExifMetadata(fileBuffer, detectedMime);

  // 4. Safe UUID filename
  const fileExt = detectedMime === 'image/png' ? 'png' : detectedMime === 'image/webp' ? 'webp' : 'jpg';
  const fileKey = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  // 5. Upload to Supabase Storage if configured
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileKey, sanitizedBuffer, {
          contentType: detectedMime,
          upsert: false,
        });

      if (error) {
        logger.warn('Supabase storage upload failed, falling back to data URL', { error: error.message });
      } else if (data) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileKey);

        return {
          url: publicUrlData.publicUrl,
          key: fileKey,
          sizeBytes: sanitizedBuffer.length,
          mimeType: detectedMime,
        };
      }
    } catch (err) {
      logger.warn('Supabase storage error', { error: (err as Error).message });
    }
  }

  // Local fallback: return base64 data URL
  const base64Str = sanitizedBuffer.toString('base64');
  return {
    url: `data:${detectedMime};base64,${base64Str}`,
    key: fileKey,
    sizeBytes: sanitizedBuffer.length,
    mimeType: detectedMime,
  };
}
