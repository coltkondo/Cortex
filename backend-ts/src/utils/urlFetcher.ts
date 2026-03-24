/**
 * Utility to fetch and extract job descriptions from URLs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  HTTP_CONFIG,
  CONTENT_VALIDATION,
  SCRAPING_SELECTORS,
  ERROR_MESSAGES,
} from '../config/constants';

export interface FetchedJobData {
  description: string;
  company?: string;
  role?: string;
  source: string;
}

/**
 * Fetches content from a URL and extracts job description text
 */
export async function fetchJobDescriptionFromURL(url: string): Promise<FetchedJobData> {
  try {
    // Validate URL
    const urlObj = new URL(url);

    // Fetch the page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': HTTP_CONFIG.USER_AGENT,
      },
      timeout: HTTP_CONFIG.URL_FETCH_TIMEOUT,
      maxRedirects: HTTP_CONFIG.MAX_REDIRECTS,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch URL: HTTP ${response.status}`);
    }

    // Parse HTML
    const $ = cheerio.load(response.data);

    // Remove script, style, and other non-content elements
    $('script, style, noscript, iframe, svg, img').remove();

    // Try to extract company name from various sources
    let company = '';
    company = $('meta[property="og:site_name"]').attr('content') || '';
    if (!company) company = $('meta[name="author"]').attr('content') || '';
    if (!company) company = $('title').text().split('|')[0].trim();

    // Try to extract role title
    let role = '';
    role = $('meta[property="og:title"]').attr('content') || '';
    if (!role) role = $('h1').first().text().trim();
    if (!role) role = $('title').text().split('-')[0].trim();

    // Extract main content
    // Try common job description containers
    let description = '';

    // Strategy 1: Look for common job description IDs/classes
    for (const selector of SCRAPING_SELECTORS.JOB_DESCRIPTION) {
      const element = $(selector);
      if (element.length > 0) {
        description = element.text().trim();
        if (description.length > CONTENT_VALIDATION.MIN_SUBSTANTIAL_CONTENT_LENGTH) {
          // Found substantial content
          break;
        }
      }
    }

    // Strategy 2: If no luck, get all text from body
    if (description.length < CONTENT_VALIDATION.MIN_SUBSTANTIAL_CONTENT_LENGTH) {
      description = $('body').text().trim();
    }

    // Clean up whitespace
    description = description
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\n\s*\n/g, '\n\n') // Multiple newlines to double
      .trim();

    // Validate we got something useful
    if (description.length < CONTENT_VALIDATION.MIN_JOB_DESCRIPTION_LENGTH) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_CONTENT);
    }

    return {
      description,
      company: company || undefined,
      role: role || undefined,
      source: urlObj.hostname,
    };
  } catch (error: any) {
    if (error.code === 'ENOTFOUND') {
      throw new Error(ERROR_MESSAGES.URL_NOT_FOUND);
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error(ERROR_MESSAGES.URL_TIMEOUT);
    } else if (error.message.includes('URL') || error.message.includes(ERROR_MESSAGES.INSUFFICIENT_CONTENT)) {
      throw error;
    }

    throw new Error(`${ERROR_MESSAGES.FETCH_FAILED}: ${error.message}`);
  }
}
