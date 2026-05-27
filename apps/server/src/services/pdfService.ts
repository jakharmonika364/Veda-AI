import puppeteer from 'puppeteer';
import { uploadBlob } from './blobService';
import type { IQuestionPaper } from '../models/QuestionPaper';

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy': return '#16a34a';
    case 'Moderate': return '#d97706';
    case 'Challenging': return '#dc2626';
    default: return '#6b7280';
  }
}

function renderPaperHTML(paper: IQuestionPaper): string {
  const sectionsHTML = paper.sections
    .map(
      (section) => `
      <div class="section">
        <h3>${section.title}</h3>
        <p class="section-type">${section.questionType}</p>
        <p class="instruction"><em>${section.instruction}</em></p>
        ${section.questions
          .map(
            (q) => `
          <div class="question">
            <span class="difficulty-badge" style="color:${getDifficultyColor(q.difficulty)};border-color:${getDifficultyColor(q.difficulty)}">
              ${q.difficulty}
            </span>
            <span class="question-text"><strong>${q.number}.</strong> ${q.text}</span>
            <span class="marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
          </div>`,
          )
          .join('')}
      </div>`,
    )
    .join('');

  const answerKeyHTML = paper.answerKey
    .map(
      (entry) =>
        `<tr><td>${entry.questionNumber}.</td><td>${entry.answer}</td></tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Question Paper</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; background: #fff; padding: 40px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
    .school-name { font-size: 18pt; font-weight: bold; text-transform: uppercase; }
    .subject-class { font-size: 14pt; margin-top: 4px; }
    .meta { display: flex; justify-content: space-between; margin: 12px 0; font-size: 11pt; }
    .notice { text-align: center; font-style: italic; font-size: 10pt; margin-bottom: 16px; }
    .student-info { border: 1px solid #000; padding: 12px; margin-bottom: 20px; display: flex; gap: 24px; }
    .student-field { flex: 1; border-bottom: 1px solid #000; padding-bottom: 4px; }
    .student-field label { font-size: 10pt; color: #444; display: block; margin-bottom: 20px; }
    .section { margin-bottom: 24px; }
    .section h3 { font-size: 13pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase; }
    .section-type { font-size: 10pt; color: #555; margin-bottom: 4px; }
    .instruction { font-size: 10pt; margin-bottom: 10px; }
    .question { display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px; padding-left: 8px; }
    .difficulty-badge { font-size: 8pt; border: 1px solid; border-radius: 4px; padding: 1px 5px; white-space: nowrap; flex-shrink: 0; }
    .question-text { flex: 1; }
    .marks { white-space: nowrap; font-size: 10pt; color: #444; }
    .end-line { text-align: center; margin: 24px 0; font-weight: bold; }
    .answer-key { margin-top: 32px; border-top: 2px dashed #000; padding-top: 16px; }
    .answer-key h3 { font-size: 13pt; font-weight: bold; margin-bottom: 12px; }
    .answer-key table { width: 100%; border-collapse: collapse; }
    .answer-key td { padding: 4px 8px; border-bottom: 1px solid #eee; font-size: 11pt; }
    .answer-key td:first-child { width: 40px; font-weight: bold; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="school-name">${paper.schoolName}</div>
    <div class="subject-class">${paper.subject} &mdash; ${paper.className}</div>
  </div>
  <div class="meta">
    <span>Time Allowed: ${paper.timeAllowed}</span>
    <span>Maximum Marks: ${paper.maxMarks}</span>
  </div>
  <div class="notice">All questions are compulsory unless stated otherwise.</div>
  <div class="student-info">
    <div class="student-field"><label>Name:</label></div>
    <div class="student-field"><label>Roll Number:</label></div>
    <div class="student-field"><label>Class &amp; Section:</label></div>
  </div>
  ${sectionsHTML}
  <div class="end-line">— End of Question Paper —</div>
  <div class="answer-key">
    <h3>Answer Key</h3>
    <table>${answerKeyHTML}</table>
  </div>
</body>
</html>`;
}

export async function generatePDF(paper: IQuestionPaper, assignmentId: string): Promise<string> {
  const html = renderPaperHTML(paper);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let pdfBuffer: Buffer;
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const pdfData = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    });
    pdfBuffer = Buffer.from(pdfData);
  } finally {
    await browser.close();
  }

  return uploadBlob(pdfBuffer, `pdfs/${assignmentId}.pdf`, 'application/pdf');
}
