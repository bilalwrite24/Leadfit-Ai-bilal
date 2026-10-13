import { Prospect } from '../types';

export function exportProspectsToCSV(prospects: Prospect[]): string {
  const headers = [
    'Full Name',
    'Title',
    'Company',
    'Email',
    'Email Status',
    'LinkedIn',
    'Location',
    'Industry',
    'Employees',
    'ICP Score',
    'Status',
    'Source',
  ];

  const rows = prospects.map((p) => [
    `"${(p.fullName || '').replace(/"/g, '""')}"`,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${(p.company || '').replace(/"/g, '""')}"`,
    `"${(p.email || '').replace(/"/g, '""')}"`,
    `"${p.emailStatus}"`,
    `"${(p.linkedinUrl || '').replace(/"/g, '""')}"`,
    `"${(p.location || '').replace(/"/g, '""')}"`,
    `"${(p.industry || '').replace(/"/g, '""')}"`,
    `"${(p.employeeCount || '').replace(/"/g, '""')}"`,
    p.icpScore,
    `"${p.status}"`,
    `"${p.source}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSVProspects(csvText: string): Partial<Prospect>[] {
  const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
  const results: Partial<Prospect>[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV split accounting for quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
    }

    if (matches.length > 0) {
      const nameIndex = headers.findIndex((h) => h.includes('name'));
      const titleIndex = headers.findIndex((h) => h.includes('title') || h.includes('role'));
      const companyIndex = headers.findIndex((h) => h.includes('company'));
      const emailIndex = headers.findIndex((h) => h.includes('email'));
      const locationIndex = headers.findIndex((h) => h.includes('location') || h.includes('city'));

      const fullName = nameIndex !== -1 ? matches[nameIndex] : matches[0] || 'Unknown Prospect';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || '';

      results.push({
        id: `imported-${Date.now()}-${i}`,
        firstName,
        lastName,
        fullName,
        title: titleIndex !== -1 ? matches[titleIndex] : 'Decision Maker',
        company: companyIndex !== -1 ? matches[companyIndex] : 'Imported Account',
        companyDomain: companyIndex !== -1 ? `${matches[companyIndex].toLowerCase().replace(/\s+/g, '')}.com` : 'example.com',
        email: emailIndex !== -1 ? matches[emailIndex] : `${firstName.toLowerCase()}@example.com`,
        emailStatus: 'unverified',
        location: locationIndex !== -1 ? matches[locationIndex] : 'United States',
        industry: 'B2B Software',
        employeeCount: '50-200 employees',
        icpScore: Math.floor(70 + Math.random() * 25),
        scoreExplanation: 'Parsed from CSV batch import. Ready for ICP qualification verification.',
        strengths: ['Imported contact target', 'Awaiting enriched signal verification'],
        buyingSignals: [],
        source: 'CSV Import',
        owner: 'Sarah Jenkins',
        status: 'qualifying',
        tags: ['CSV Import'],
        lastActivity: 'Imported via CSV',
        notes: ['Imported via user CSV upload.'],
      });
    }
  }

  return results;
}
