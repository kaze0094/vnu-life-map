'use client';
import {Theme} from '@astryxdesign/core/theme';
import {VStack} from '@astryxdesign/core/VStack';
import {themes, defaultThemeSlug} from '../astryx-themes';

export default function UITheme({children}: {children: React.ReactNode}) {
  return <Theme theme={themes[defaultThemeSlug]} mode="light"><VStack className="life-theme">{children}</VStack></Theme>;
}
