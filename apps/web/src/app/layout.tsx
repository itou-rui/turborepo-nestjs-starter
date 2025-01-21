import { join } from 'path';
import fs from 'fs';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Toaster } from '@workspace/ui/components/sonner';
import { type LayoutProps } from '@/types';
import { ReduxProvider, ThemeProvider } from '@/components/Providers';
import '../../styles/globals.css';

/**
 * Get the paths to the CSS files based on the page.
 * @param {string | null} page - The current page path.
 * @returns {string[]} - An array of CSS file paths.
 */
function getCSSPaths(page: string | null): string[] {
	const basePath = join('/_next', 'static', 'css');
	const globalCSS = join(basePath, 'globals.css');
	if (page?.startsWith('/dynamic')) {
		return [join(basePath, 'dynamic.css'), globalCSS];
	}
	return [globalCSS];
}

/**
 * Get the critical CSS for the given page.
 * @param {string | null} page - The current page path.
 * @returns {Promise<JSX.Element | false>} - A promise that resolves to a style element with the critical CSS or false if not found.
 */
async function getCriticalCSS(page: string | null): Promise<JSX.Element | false> {
	if (!page) return false;

	const withoutQuery = page.split('?')[0];
	const cssPath = join(process.cwd(), 'critters', withoutQuery, 'styles.css');

	try {
		const cssContent = await fs.promises.readFile(cssPath, 'utf-8');
		return <style dangerouslySetInnerHTML={{ __html: cssContent }} />;
	} catch {
		return false;
	}
}

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

/**
 * The root layout component for the application.
 * @param {LayoutProps} props - The layout properties.
 * @returns {JSX.Element} - The root layout component.
 */
export default async function RootLayout(props: LayoutProps): Promise<JSX.Element> {
	const headersList = headers();
	const pathName = (await headersList).get('x-pathname');
	const criticalCSS = await getCriticalCSS(pathName);
	const isCriticalCSSMode = process.env.CRITTERS_RUNTIME && criticalCSS;

	const cssLinks = getCSSPaths(pathName).map((link) => <link key={link} rel='stylesheet' href={link} />);

	return (
		<html lang='en' suppressHydrationWarning>
			<head>{isCriticalCSSMode ? criticalCSS : cssLinks}</head>
			<body>
				<ThemeProvider>
					<ReduxProvider>
						{props.children}
						{isCriticalCSSMode && cssLinks}
						<Toaster />
					</ReduxProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
