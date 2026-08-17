import React from 'react';
import { Palette, LayoutTemplate, Check } from 'lucide-react';
import { InvoiceTheme, TemplateStyle } from '../types';
import { INVOICE_THEMES } from '../data/themes';

interface ThemeSelectorProps {
  currentTheme: InvoiceTheme;
  onThemeChange: (theme: InvoiceTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const templates: { id: TemplateStyle; name: string; desc: string }[] = [
    { id: 'modern', name: 'Modern Split', desc: 'Clean, balanced header with crisp lines' },
    { id: 'executive', name: 'Executive Header', desc: 'Bold banner with corporate contrast' },
    { id: 'classic', name: 'Classic Framed', desc: 'Traditional corporate typography' },
    { id: 'minimal', name: 'Minimalist', desc: 'Sleek, high whitespace & typography' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Branding & Template Style</h3>
            <p className="text-xs text-slate-500">Pick invoice accent colors & visual layout</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Color Palette Swatches */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Accent Color</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {INVOICE_THEMES.map((theme) => {
              const isSelected = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() =>
                    onThemeChange({
                      ...theme,
                      template: currentTheme.template, // keep active layout
                    })
                  }
                  className={`group p-2 rounded-lg border text-left transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-105"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 truncate w-full text-center">
                    {theme.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Style Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Template Layout</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {templates.map((tpl) => {
              const isSelected = currentTheme.template === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() =>
                    onThemeChange({
                      ...currentTheme,
                      template: tpl.id,
                    })
                  }
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{tpl.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                    {tpl.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
