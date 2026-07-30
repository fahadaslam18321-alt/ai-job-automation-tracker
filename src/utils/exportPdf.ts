import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CandidateProfile } from '../types';

export interface PdfExportData {
  profile: CandidateProfile;
  jobTitle?: string;
  companyName?: string;
  tailoredBullets?: string[];
  coverLetter?: string;
}

export async function generateAtsResumePdf(data: PdfExportData): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '45px 55px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Helvetica, Arial, sans-serif';
  container.style.fontSize = '12px';
  container.style.lineHeight = '1.5';
  container.style.boxSizing = 'border-box';

  const bulletsHtml = (data.tailoredBullets || [])
    .map(b => `<li style="margin-bottom: 8px; text-align: justify; line-height: 1.5;">${b}</li>`)
    .join('');

  const skillsHtml = (data.profile.skills || [])
    .map(s => `<span style="display: inline-block; background: #f8fafc; border: 1px solid #cbd5e1; padding: 4px 10px; margin: 3px 6px 3px 0; border-radius: 6px; font-weight: 700; font-size: 11px; color: #0f172a;">${s}</span>`)
    .join('');

  const targetRoleText = data.jobTitle 
    ? `${data.jobTitle} ${data.companyName ? `• ${data.companyName}` : ''}`
    : data.profile.currentRole;

  container.innerHTML = `
    <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 22px;">
      <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px;">
        ${data.profile.fullName || 'Candidate Name'}
      </h1>
      <p style="font-size: 14px; font-weight: 700; color: #3b82f6; margin: 0 0 6px 0;">
        ${targetRoleText}
      </p>
      <p style="font-size: 11px; color: #64748b; margin: 0;">
        ${data.profile.email || ''} | ${data.profile.phone || ''}
      </p>
    </div>

    ${data.tailoredBullets && data.tailoredBullets.length > 0 ? `
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 12px;">
          Tailored Accomplishments & Technical Bullet Points
        </h2>
        <ul style="margin: 0; padding-left: 22px; color: #334155;">
          ${bulletsHtml}
        </ul>
      </div>
    ` : ''}

    <div style="margin-bottom: 22px;">
      <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 12px;">
        Core Technical Stack & Competencies
      </h2>
      <div style="padding-top: 2px;">
        ${skillsHtml}
      </div>
    </div>

    <div style="margin-bottom: 22px;">
      <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 12px;">
        Professional Experience Summary
      </h2>
      <div style="white-space: pre-wrap; font-size: 11px; color: #334155; line-height: 1.6;">
        ${data.profile.resumeText || ''}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 10) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const cleanName = (data.profile.fullName || 'Candidate').replace(/\s+/g, '_');
    const cleanRole = (data.jobTitle || 'Tailored').replace(/\s+/g, '_');
    const filename = `${cleanName}_Resume_${cleanRole}.pdf`;
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
