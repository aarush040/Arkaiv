import { jsPDF } from 'jspdf';

export function downloadPrototypeSpecPDF(
  userGoal: string,
  userLevel: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Palette definition
  const cDark = [15, 23, 42];      // Slate 900
  const cBrand = [79, 70, 229];    // Indigo 600
  const cMuted = [100, 116, 139];  // Slate 500
  const cEmerald = [16, 185, 129]; // Emerald 500
  const cAmber = [245, 158, 11];    // Amber 500
  const cLightBg = [248, 250, 252]; // Slate 50

  // Helper to draw a sleek footer on any page
  const drawPageFooter = (pageNum: number, totalPages: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text('ARKAIV PROTOTYPE STORYBOARDS • DOCUMENT ID: ARKAIV-DS-2026', margin, 276);
    doc.setFont('helvetica', 'normal');
    doc.text('Subject to active licensing algorithms. Generated exclusively for sharing and review.', margin, 281);
    doc.text(`Page ${pageNum} of ${totalPages}`, margin + contentWidth - 14, 281);
  };

  // Helper to draw the persistent outer border
  const drawPageBorder = () => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');
  };

  // ==========================================
  // PAGE 1: COVER & SYSTEM BLUEPRINT DESIGNS
  // ==========================================
  drawPageBorder();

  // Brand header accent banner
  doc.setFillColor(cDark[0], cDark[1], cDark[2]);
  doc.rect(margin, 15, contentWidth, 38, 'F');

  // Colored indicator stripes
  doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.rect(margin, 15, contentWidth / 3, 2, 'F');
  doc.setFillColor(cAmber[0], cAmber[1], cAmber[2]);
  doc.rect(margin + (contentWidth / 3), 15, contentWidth / 3, 2, 'F');
  doc.setFillColor(cEmerald[0], cEmerald[1], cEmerald[2]);
  doc.rect(margin + (contentWidth * 2 / 3), 15, contentWidth / 3, 2, 'F');

  // Title elements
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('ARKAIV WORKSPACE', margin + 8, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(199, 210, 254);
  doc.text('INTERACTIVE UX/UI PROTOTYPE & ARCHITECTURE SPECIFICATION', margin + 8, 34);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`TARGET CURRICULUM PROFILE:  ${userGoal.toUpperCase()} (${userLevel})`, margin + 8, 45);

  let currentY = 62;

  // Overview Introduction card
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.rect(margin, currentY, contentWidth, 24, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.text('I. PROTOTYPE DESIGN OVERVIEW', margin + 6, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  const introText = `Arkaiv is an advanced personalized educational prototype built on React 18, Vite, and Tailwind CSS. The interface adopts a professional Swiss Modernist aesthetic with bold display typography, high-contrast states, and responsive bento-inspired modules. This blueprint layout spec details the system's screen components to present to stakeholders.`;
  const wrappedIntro = doc.splitTextToSize(introText, contentWidth - 12);
  doc.text(wrappedIntro, margin + 6, currentY + 12);

  currentY += 32;

  // Core Brand Palette Specifications
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('II. SPECIFIED LUXURY BRAND PALETTE', margin, currentY);

  // Decorative header line
  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 6;

  const palettes = [
    { name: 'Slate Dark (Slate 950)', use: 'Main Banner Backgrounds & Primary Titles', value: '#0f172a', rgb: cDark },
    { name: 'Indigo Aura (Indigo 600)', use: 'Primary Buttons, Active Accents & Glow States', value: '#4f46e5', rgb: cBrand },
    { name: 'Emerald Peak (Emerald 500)', use: 'Completed Tasks, Grades & Streak Success Levels', value: '#10b981', rgb: cEmerald },
    { name: 'Amber Core (Amber 500)', use: 'Experience Multipliers & Streak Accelerators', value: '#f59e0b', rgb: cAmber }
  ];

  palettes.forEach((pal) => {
    // Left colored pill
    doc.setFillColor(pal.rgb[0], pal.rgb[1], pal.rgb[2]);
    doc.rect(margin, currentY, 8, 8, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(margin, currentY, 8, 8, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(pal.name, margin + 12, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text(`Hex Value:  ${pal.value}   |   Application: ${pal.use}`, margin + 55, currentY + 5);

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + 11, margin + contentWidth, currentY + 11);

    currentY += 13;
  });

  currentY += 3;

  // Typographic Scale Wireframes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('III. TYPOGRAPHIC BLUEPRINTS & WEIGHTS', margin, currentY);

  // Decorative header line
  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 6;

  const typographies = [
    { scale: 'Display Title-H1', size: '22pt', weight: 'Black Weight', font: 'Space Grotesk / Inter', use: 'Arkaiv Primary Dashboard Branding & Cover Headers' },
    { scale: 'Section Header-H2', size: '13pt', weight: 'Extrabold Weight', font: 'Inter Display / Bold', use: 'Bento Modules headers & Left Navigation Items' },
    { scale: 'Body Regular-Body', size: '9.5pt', weight: 'Normal Weight', font: 'Inter Sans-Serif', use: 'Description blocks, instructions & assistant logs' },
    { scale: 'Telemetry Metrics-Mono', size: '8pt', weight: 'Medium Monospace', font: 'JetBrains Mono', use: 'XP Counters, Streak states & Code playground widgets' }
  ];

  typographies.forEach((typo) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(typo.scale, margin, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text(`Font: ${typo.font}  (${typo.size} - ${typo.weight})   |  Use: ${typo.use}`, margin + 45, currentY + 5);

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + 10, margin + contentWidth, currentY + 10);

    currentY += 12;
  });

  drawPageFooter(1, 4);

  // ==========================================
  // PAGE 2: CORE MODULES PART A (MODULE 1 & 2)
  // ==========================================
  doc.addPage();
  drawPageBorder();

  // Page 2 header
  doc.setFillColor(cDark[0], cDark[1], cDark[2]);
  doc.rect(margin, 15, contentWidth, 14, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ARKAIV PROTOTYPE LAYOUT SPECS', margin + 6, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(199, 210, 254);
  doc.text('SECTION B: WORKFLOW LAYOUTS - PART 1', margin + contentWidth - 75, 24);

  currentY = 38;

  // Description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('IV. SYSTEM SCREENS: TIMELINE & PRACTICAL LABS', margin, currentY);

  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 8;

  const screensPage2 = [
    {
      title: 'Module 1: Adaptive Mastery Roadmap Timeline',
      elements: [
        'A. Adaptive Hero Info: Dynamic banner responding to personalized goal baselines and syllabus progress calibrations.',
        'B. Curated Milestones Graph: 3-column interactive card states displaying completed (success), active (radial glows), and locked nodes.',
        'C. Daily Missions Agenda: Checkbox-driven daily tasks that trigger immediate layout state updates and notifications on study progress.'
      ]
    },
    {
      title: 'Module 2: Practical Labs & Calculus Evaluator',
      elements: [
        'A. Resource Upload Dropzone: Interactive drag-and-drop sandbox panel accepting CBSE / NCERT worksheets, code, or python sheets.',
        'B. Grading Engine Analytics: Autonomous execution simulator that tests matrices dimensions & mathematics logic in a secure sandbox.',
        'C. Submissions Logs Ledger: Historic ledger displaying previous uploads, evaluated weights, status, and custom score indexes.'
      ]
    }
  ];

  screensPage2.forEach((scr, sIdx) => {
    // Module container card with generous spacious height
    doc.setFillColor(252, 253, 254);
    doc.rect(margin, currentY, contentWidth, 50, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, currentY, contentWidth, 50, 'S');

    // Colored vertical indicator
    doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
    doc.rect(margin, currentY, 1.2, 50, 'F');

    // Content Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(`${sIdx + 1}. ${scr.title.toUpperCase()}`, margin + 5, currentY + 6);

    // List of specs elements
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    
    let bulletY = currentY + 13;
    scr.elements.forEach((elem) => {
      doc.text('•', margin + 6, bulletY);
      const wrappedElem = doc.splitTextToSize(elem, contentWidth - 14);
      doc.text(wrappedElem, margin + 9, bulletY);
      bulletY += 11;
    });

    currentY += 56;
  });

  // UX Synapse Remarks card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.rect(margin, currentY, contentWidth, 32, 'F');
  doc.rect(margin, currentY, contentWidth, 32, 'S');

  doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.rect(margin, currentY, 1.2, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('ROADMAP & LAB EVALUATOR SYNAPSE DETAILS', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  const page2Remarks = `The roadmap timeline represents the primary sequencing motor under NEP 2020 directives. It continuously synchronizes mathematical concept thresholds (DIKSHA modules) with active lab submissions. Successful sandbox submission execution triggers state alterations in the Milestone tracker on the fly, transforming static roadmap models into a reactive gamified calendar.`;
  const wrappedRemarks2 = doc.splitTextToSize(page2Remarks, contentWidth - 10);
  doc.text(wrappedRemarks2, margin + 5, currentY + 12);

  drawPageFooter(2, 4);

  // ==========================================
  // PAGE 3: CORE MODULES PART B (MODULE 3 & 4)
  // ==========================================
  doc.addPage();
  drawPageBorder();

  // Page 3 header
  doc.setFillColor(cDark[0], cDark[1], cDark[2]);
  doc.rect(margin, 15, contentWidth, 14, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ARKAIV PROTOTYPE LAYOUT SPECS', margin + 6, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(199, 210, 254);
  doc.text('SECTION B: WORKFLOW LAYOUTS - PART 2', margin + contentWidth - 75, 24);

  currentY = 38;

  // Description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('IV. SYSTEM SCREENS: PERFORMANCE & DIALOGUE LABS', margin, currentY);

  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 8;

  const screensPage3 = [
    {
      title: 'Module 3: Analytics Dashboard & Mastery Metrics Network',
      elements: [
        'A. Adaptive Dial Index: Progress indicators showing remainder XP quotients, daily streak tickers, and active status levels in the upper banner.',
        'B. Mastery Charting Panels: Dynamic grid plots illustrating syllabus completion velocities, learning hours distribution, and weekly matrices calibration.',
        'C. Achievement Badges Vault: Nested grid system displaying unlocked skill stamps (NCERT Explorer, Calculus Sovereign, Matrix Sorcerer).'
      ]
    },
    {
      title: 'Module 4: Conversational Dialogue AI Mentor Lab',
      elements: [
        'A. Intelligent Counsel Chat: Multi-turn message container rendering detailed code snippets, explanations, and multilingual guidelines.',
        'B. Interactive Cue Ribbon: Float tags and action cues supporting prompt execution on spaced repetition calculus topics.',
        'C. Contextual Sandbox Integration: Instant feedback mechanics linking mathematical doubts directly into the code and equation solver.'
      ]
    }
  ];

  screensPage3.forEach((scr, sIdx) => {
    // Module container card with generous spacious height
    doc.setFillColor(252, 253, 254);
    doc.rect(margin, currentY, contentWidth, 50, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, currentY, contentWidth, 50, 'S');

    // Colored vertical indicator
    doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
    doc.rect(margin, currentY, 1.2, 50, 'F');

    // Content Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(`${sIdx + 3}. ${scr.title.toUpperCase()}`, margin + 5, currentY + 6);

    // List of specs elements
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    
    let bulletY = currentY + 13;
    scr.elements.forEach((elem) => {
      doc.text('•', margin + 6, bulletY);
      const wrappedElem = doc.splitTextToSize(elem, contentWidth - 14);
      doc.text(wrappedElem, margin + 9, bulletY);
      bulletY += 11;
    });

    currentY += 56;
  });

  // UX Dialogue Remarks Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.rect(margin, currentY, contentWidth, 32, 'F');
  doc.rect(margin, currentY, contentWidth, 32, 'S');

  doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.rect(margin, currentY, 1.2, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('ANALYTICS & CONVERSATIONAL DIALOGUE INTEGRATION', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  const page3Remarks = `The analytics dashboard translates granular execution performance into visual representations. When combined with the multi-turn conversational companion (utilizing modern @google/genai RAG techniques), the student receives immediate diagnostic counsel aligned to real-time telemetry drops. Error logs are automatically parsed in the background to inject personalized prompt suggestions into the prompt ribbon.`;
  const wrappedRemarks3 = doc.splitTextToSize(page3Remarks, contentWidth - 10);
  doc.text(wrappedRemarks3, margin + 5, currentY + 12);

  drawPageFooter(3, 4);

  // ==========================================
  // PAGE 4: TECHNICAL INTERACTION BLUEPRINTS
  // ==========================================
  doc.addPage();
  drawPageBorder();

  // Page 4 header
  doc.setFillColor(cDark[0], cDark[1], cDark[2]);
  doc.rect(margin, 15, contentWidth, 14, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ARKAIV PROTOTYPE LAYOUT SPECS', margin + 6, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(199, 210, 254);
  doc.text('SECTION C: TECHNICAL SPECIFICATIONS & PEDAGOGY', margin + contentWidth - 85, 24);

  currentY = 38;

  // Description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('V. SYSTEM CORE & DEPLOYMENT PROTOCOLS', margin, currentY);

  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 8;

  // Detailed Spec Card 1: Deployment & Port Mappings
  doc.setFillColor(252, 253, 254);
  doc.rect(margin, currentY, contentWidth, 38, 'F');
  doc.setDrawColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 38, 'S');

  doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.rect(margin, currentY, 1.2, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('1. CONTAINER INGRESS & PLATFORM ARCHITECTURE', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  const ingressDetails = `• Port & Ingress: Dedicated proxy endpoints bind client queries exclusively on port 3000.
• Production Bundling: Node CJS compiling processes optimize script delivery and reduce server cold-starts in high-concurrency environments.
• API Resilience: The application executes direct full-stack routing to guard environment credentials and private tokens from browser clients.`;
  const wrappedIngress = doc.splitTextToSize(ingressDetails, contentWidth - 10);
  doc.text(wrappedIngress, margin + 5, currentY + 12);

  currentY += 44;

  // Detailed Spec Card 2: National Education Integration & Pedagogy
  doc.setFillColor(252, 253, 254);
  doc.rect(margin, currentY, contentWidth, 38, 'F');
  doc.setDrawColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 38, 'S');

  doc.setFillColor(cEmerald[0], cEmerald[1], cEmerald[2]);
  doc.rect(margin, currentY, 1.2, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('2. NATIONAL PEDAGOGY & CURRICULUM SYNC (NEP 2020)', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  const nepDetails = `• Experiential Syllabus Maps: Integrated APIs draw direct courseware objects from government repositories (DIKSHA / SWAYAM nodes).
• Skill-Based Micro-credits: Progression tracks convert successful Calculus execution logs into verified knowledge points in alignment with the National Credit Framework (NCrF).
• Vernacular Portability: Interactivity switches dynamically between Hindi, Tamil, and English modes for widespread accessibility across regions.`;
  const wrappedNep = doc.splitTextToSize(nepDetails, contentWidth - 10);
  doc.text(wrappedNep, margin + 5, currentY + 12);

  currentY += 44;

  // Detailed Spec Card 3: Continuous Diagnostic & Remedial Engine
  doc.setFillColor(252, 253, 254);
  doc.rect(margin, currentY, contentWidth, 38, 'F');
  doc.setDrawColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 38, 'S');

  doc.setFillColor(cAmber[0], cAmber[1], cAmber[2]);
  doc.rect(margin, currentY, 1.2, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('3. CONTINUOUS ASSESSMENT & WEAKNESS DETECTOR', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  const assessmentDetails = `• Gap Identification: Automated sub-module performance trackers isolate conceptual weaknesses (such as dimension mismatches or gradient sign faults).
• Adaptive Remedial Paths: Instantly alters workspace layout sequences to present 10-minute visual focus simulations for custom recovery.
• Proofs Validation Sandbox: Checks execution parameters of local student assignments to enforce non-rote comprehension.`;
  const wrappedAssessment = doc.splitTextToSize(assessmentDetails, contentWidth - 10);
  doc.text(wrappedAssessment, margin + 5, currentY + 12);

  drawPageFooter(4, 4);

  // Download PDF spec
  const formattedFileName = `arkaiv_${userGoal.toLowerCase().replace(/\s+/g, '_')}_prototype_spec.pdf`;
  doc.save(formattedFileName);
}

export function downloadProgressInsightsPDF(
  studentName = "Priya Verma",
  userGoal = "Become a Full-Stack Developer & Startup Founder",
  userLevel = "B.Tech 2nd Year"
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  const cDark = [15, 23, 42];      // Slate 900
  const cBrand = [79, 70, 229];    // Indigo 600
  const cMuted = [100, 116, 139];  // Slate 500
  const cEmerald = [16, 185, 129]; // Emerald 500
  const cAmber = [245, 158, 11];    // Amber 500
  const cLightBg = [248, 250, 252]; // Slate 50

  const drawPageFooter = (pageNum: number, totalPages: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text('ARKAIV STUDENT PROGRESS PORTFOLIO • REPORT CERTIFIED BY NEP-2020 PLATFORM', margin, 276);
    doc.setFont('helvetica', 'normal');
    doc.text('This document verifies academic mastery and predictive career alignment analysis.', margin, 281);
    doc.text(`Page ${pageNum} of ${totalPages}`, margin + contentWidth - 14, 281);
  };

  const drawPageBorder = () => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');
  };

  drawPageBorder();

  // Draw elegant head banner
  doc.setFillColor(cDark[0], cDark[1], cDark[2]);
  doc.rect(margin, 15, contentWidth, 38, 'F');

  // Colored indicator stripes
  doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.rect(margin, 15, contentWidth / 3, 2, 'F');
  doc.setFillColor(cAmber[0], cAmber[1], cAmber[2]);
  doc.rect(margin + (contentWidth / 3), 15, contentWidth / 3, 2, 'F');
  doc.setFillColor(cEmerald[0], cEmerald[1], cEmerald[2]);
  doc.rect(margin + (contentWidth * 2 / 3), 15, contentWidth / 3, 2, 'F');

  // Title elements
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ARKAIV PERSONALIZED INSIGHTS REPORT', margin + 8, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(199, 210, 254);
  doc.text('OFFICIAL ACADEMIC PROGRESS PORTFOLIO & PREDICTIVE CAREER ALIGNMENT', margin + 8, 34);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`STUDENT: ${studentName.toUpperCase()}  |  ${userLevel.toUpperCase()}`, margin + 8, 45);

  let currentY = 62;

  // Student Profile Snapshot Card
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.rect(margin, currentY, contentWidth, 30, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 30, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.text('I. STUDENT PROFILE SNAPSHOT', margin + 6, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text(`Target Goal:  ${userGoal}`, margin + 6, currentY + 12);
  doc.text(`Institution:   Motilal Nehru National Institute of Technology (MNNIT / NIT Allahabad)`, margin + 6, currentY + 17);
  doc.text(`Current Streak:   12 Days Active      |      Total Learning Experience: 4,850 XP`, margin + 6, currentY + 22);

  currentY += 38;

  // Overall Subject Mastery Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('II. OVERALL MASTERY & DOMAIN BREAKDOWN', margin, currentY);

  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 8;

  // Draw circular indicator stand-in (78% overall mastery)
  doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.rect(margin, currentY, 35, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('78%', margin + 11, currentY + 12);
  doc.setFontSize(7);
  doc.text('OVERALL MASTERY', margin + 4, currentY + 18);

  // Subject breakdown lines
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Domain Mastery Breakdown:', margin + 42, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Frontend Engineering (React, Next.js, Styling):', margin + 42, currentY + 10);
  doc.setTextColor(cEmerald[0], cEmerald[1], cEmerald[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('92% (Exemplary - Tier 1)', margin + 120, currentY + 10);

  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('Backend Architecture (Node.js, Express, DBs):', margin + 42, currentY + 15);
  doc.setTextColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('65% (Proficient - Tier 2)', margin + 120, currentY + 15);

  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('System Design & Scaling (Architecture, Cloud):', margin + 42, currentY + 20);
  doc.setTextColor(cAmber[0], cAmber[1], cAmber[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('55% (Developing - Tier 3)', margin + 120, currentY + 20);

  currentY += 34;

  // Skill Gap Analysis & Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('III. CALIBRATED SKILL GAPS & NEP ACCREDITED RECOMMENDATIONS', margin, currentY);

  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 8;

  const gaps = [
    { area: "Database Scaling & Normalization", gap: "Deep gap in horizontal scaling & Caching (Redis/Memcached)", rec: "Complete advanced MongoDB/Postgres indexing labs." },
    { area: "Backpropagation Math & Gradients", gap: "Lacks core proofs on matrix chain rule derivations", rec: "Practice 5 high-recall gradient quiz exercises in Mentor." },
    { area: "System Design Patterns & Load Balancers", gap: "Conceptual grasp of Nginx and CDN caching is introductory", rec: "Examine system architecture modules mapped to SWAYAM/NEP." }
  ];

  gaps.forEach((g) => {
    doc.setFillColor(252, 253, 254);
    doc.rect(margin, currentY, contentWidth, 16, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, currentY, contentWidth, 16, 'S');

    doc.setFillColor(cBrand[0], cBrand[1], cBrand[2]);
    doc.rect(margin, currentY, 1.2, 16, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(g.area, margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text(`Identified Gap: ${g.gap}`, margin + 4, currentY + 9);
    doc.setTextColor(cBrand[0], cBrand[1], cBrand[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Recommendation: ${g.rec}`, margin + 4, currentY + 13);

    currentY += 19;
  });

  currentY += 2;

  // Predictive Insights
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('IV. SYSTEM DIAGNOSTIC PREDICTIVE INSIGHTS', margin, currentY);

  doc.setDrawColor(cBrand[0], cBrand[1], cBrand[2]);
  doc.line(margin, currentY + 1.5, margin + 25, currentY + 1.5);

  currentY += 8;

  const metrics = [
    { label: "Projected CGPA Scale", value: "8.7 / 10.0", detail: "Maintains strong upward semester trend." },
    { label: "Goal Career Alignment Match", value: "89% Synergy", detail: "Aligned to industry Full-Stack standards." },
    { label: "Est. Duration to Reach Goal", value: "4.5 Months", detail: "Accelerated based on 2-hour daily commits." },
    { label: "Academic Dropout Risk Factor", value: "Low (5% Ratio)", detail: "High core streak and retention logs." }
  ];

  metrics.forEach((m, idx) => {
    const colWidth = contentWidth / 2 - 3;
    const isRight = idx % 2 === 1;
    const cardX = isRight ? margin + colWidth + 6 : margin;
    const cardY = idx >= 2 ? currentY + 16 : currentY;

    doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
    doc.rect(cardX, cardY, colWidth, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(cardX, cardY, colWidth, 12, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(m.label, cardX + 3, cardY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cBrand[0], cBrand[1], cBrand[2]);
    doc.text(m.value, cardX + colWidth - 25, cardY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text(m.detail, cardX + 3, cardY + 9);
  });

  drawPageFooter(1, 1);

  const formattedFileName = `arkaiv_progress_insights_${studentName.toLowerCase().replace(/\s+/g, '_')}.pdf`;
  doc.save(formattedFileName);
}
