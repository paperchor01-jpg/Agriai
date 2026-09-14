'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { AdvisoryItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface AdvisorySnippetProps {
  advisory?: AdvisoryItem;
}

export function AdvisorySnippet({ advisory }: AdvisorySnippetProps) {
  if (!advisory) return null;

  return (
    <div className="glass-card bg-gradient-to-br from-white/90 via-emerald-50/40 to-teal-50/40 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-emerald-950/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs text-left flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-emerald-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Today&apos;s Smart Advisory
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Most critical field recommendation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="danger" size="sm">
              {advisory.priority} Priority
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
              {advisory.category}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>{advisory.timing}</span>
            </span>
          </div>

          <h4 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
            {advisory.title}
          </h4>

          <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-emerald-200/80 dark:border-zinc-700 shadow-2xs space-y-1">
            <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">
              <strong className="text-slate-800 dark:text-zinc-100">Reason:</strong> {advisory.reason}
            </p>
            <p className="text-xs text-emerald-950 dark:text-emerald-300 font-bold leading-relaxed pt-1 border-t border-slate-100 dark:border-zinc-700">
              <strong className="text-emerald-800 dark:text-emerald-400">Action:</strong> {advisory.action}
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/advisory"
        className="mt-4 pt-3 border-t border-emerald-100 dark:border-zinc-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between group cursor-pointer"
      >
        <span>View All Advisories</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
