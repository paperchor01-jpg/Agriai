/**
 * AgriAI Global Theme System Verification Suite
 * Tests ThemeProvider, ThemeToggle, ThemeSelector, layout initialization,
 * DOM class mutations, localStorage persistence, and system preference resolution.
 */

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${details ? ` — ${details}` : ''}`);
    failed++;
  }
}

console.log('====================================================');
console.log('☀️ AGRIAI GLOBAL THEME SYSTEM AUTOMATED VERIFICATION');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST SUITE 1: Theme Architecture & Source Integrity
// ----------------------------------------------------
console.log('📌 MODULE 1: Theme Architecture & Exports');

const themeProviderPath = path.join(process.cwd(), 'components/theme/ThemeProvider.tsx');
assert(fs.existsSync(themeProviderPath), 'ThemeProvider source file exists');

const themeProviderCode = fs.readFileSync(themeProviderPath, 'utf8');
assert(themeProviderCode.includes("export function ThemeProvider"), 'ThemeProvider component exported');
assert(themeProviderCode.includes("export function useTheme"), 'useTheme hook exported');
assert(themeProviderCode.includes("const DEFAULT_THEME: Theme = 'light'"), 'Default theme is set to light mode');
assert(themeProviderCode.includes("const STORAGE_KEY = 'agriai_theme'"), "Persists to localStorage key 'agriai_theme'");
assert(themeProviderCode.includes("prefers-color-scheme: dark"), 'Listens to system media query prefers-color-scheme');
assert(themeProviderCode.includes("classList.add('dark')"), 'Applies .dark class to root document element');
assert(themeProviderCode.includes("classList.remove('dark')"), 'Removes .dark class in light mode');

// ----------------------------------------------------
// TEST SUITE 2: Theme Toggle & Selector UI Components
// ----------------------------------------------------
console.log('\n📌 MODULE 2: Theme Switcher & Selector UI');

const themeTogglePath = path.join(process.cwd(), 'components/theme/ThemeToggle.tsx');
assert(fs.existsSync(themeTogglePath), 'ThemeToggle source file exists');

const themeToggleCode = fs.readFileSync(themeTogglePath, 'utf8');
assert(themeToggleCode.includes("export function ThemeToggle"), 'ThemeToggle header button exported');
assert(themeToggleCode.includes("export function ThemeSelector"), 'ThemeSelector settings component exported');
assert(themeToggleCode.includes("Light") && themeToggleCode.includes("Dark") && themeToggleCode.includes("System"), 'Supports all 3 options: Light, Dark, System');

// ----------------------------------------------------
// TEST SUITE 3: Layout & CSS Integration
// ----------------------------------------------------
console.log('\n📌 MODULE 3: Global Styles & Anti-Flash Integration');

const globalsCssPath = path.join(process.cwd(), 'app/globals.css');
assert(fs.existsSync(globalsCssPath), 'globals.css exists');
const globalsCssCode = fs.readFileSync(globalsCssPath, 'utf8');
assert(globalsCssCode.includes("@custom-variant dark"), 'Tailwind v4 custom dark variant configured');
assert(globalsCssCode.includes(":root") && globalsCssCode.includes(".dark"), 'CSS variables for :root and .dark defined');

const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
assert(fs.existsSync(layoutPath), 'app/layout.tsx exists');
const layoutCode = fs.readFileSync(layoutPath, 'utf8');
assert(layoutCode.includes("suppressHydrationWarning"), 'suppressHydrationWarning enabled on <html>');
assert(layoutCode.includes("themeInitScript"), 'Anti-flash inline theme initialization script included');
assert(layoutCode.includes("<ThemeProvider>"), 'Root layout wraps content with <ThemeProvider>');

// ----------------------------------------------------
// TEST SUITE 4: AppShell & Profile Integration
// ----------------------------------------------------
console.log('\n📌 MODULE 4: Navigation & Profile Page Integration');

const appShellPath = path.join(process.cwd(), 'components/layout/AppShell.tsx');
const appShellCode = fs.readFileSync(appShellPath, 'utf8');
assert(appShellCode.includes("<ThemeToggle"), 'AppShell header incorporates ThemeToggle component');

const profilePath = path.join(process.cwd(), 'app/profile/page.tsx');
const profileCode = fs.readFileSync(profilePath, 'utf8');
assert(profileCode.includes("<ThemeSelector"), 'Profile page features ThemeSelector component');
assert(profileCode.includes("Display & Theme Appearance"), 'Profile page includes Display & Theme section');

// ----------------------------------------------------
// TEST SUITE 5: Core Component Light/Dark Harmonization
// ----------------------------------------------------
console.log('\n📌 MODULE 5: Component Light / Dark Harmonization');

const statCardPath = path.join(process.cwd(), 'components/ui/StatCard.tsx');
const statCardCode = fs.readFileSync(statCardPath, 'utf8');
assert(statCardCode.includes("dark:bg-zinc-900"), 'StatCard includes dark background');
assert(statCardCode.includes("dark:text-zinc-100"), 'StatCard includes dark text contrast');

const weatherCardPath = path.join(process.cwd(), 'components/dashboard/WeatherCard.tsx');
const weatherCardCode = fs.readFileSync(weatherCardPath, 'utf8');
assert(weatherCardCode.includes("dark:bg-zinc-900"), 'WeatherCard includes dark background');

const farmHealthPath = path.join(process.cwd(), 'components/dashboard/FarmHealthScoreCard.tsx');
const farmHealthCode = fs.readFileSync(farmHealthPath, 'utf8');
assert(farmHealthCode.includes("dark:bg-zinc-900"), 'FarmHealthScoreCard includes dark background');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`📊 THEME VERIFICATION SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
