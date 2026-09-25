import { BLUEPRINT_DRAWINGS, FIVERR_COMMISSION_BRIEFS } from '../data/blueprintData.ts';
import { MASTER_PROJECT_BRIEF } from '../data/masterBriefText.ts';
import { ENGINEER_HANDOVER_SPEC, AQUAPONICS_GROWER_SPEC } from '../data/engineerAndGrowerHandover.ts';

export function downloadBlueprintMarkdown(): void {
  const dateStr = new Date().toISOString().split('T')[0];
  
  let md = `# MS. HEAVY METAL LEAF — FABRICATION BLUEPRINTS & FIVERR BUILDER SPECIFICATION
**Autonomous Hyperaccumulator Bio-Bot & Aero-Spore Reconnaissance Drone**
*Document Code: ML-SPEC-GLOBAL-2026 | Revision: D.4 (Fabrication Ready) | Date: ${dateStr}*

---

## 1. PRIMARY BOTANICAL IDENTITY: ACTUAL LIVING HYPERACCUMULATOR PLANT
> **CRITICAL ARCHITECTURAL MANDATE FOR FREELANCERS & ENGINEERS:**  
> **Ms. Heavy Metal Leaf is NOT a conventional synthetic plastic/metal robot.** She is an **ACTUAL, REAL LIVING HYPERACCUMULATOR BOTANICAL PLANT** (incorporating living hyperaccumulator flora like *Alyssum bertolonii*, *Noccaea caerulescens*, and *Pityrogramma calomelanos*) grown and cultured directly inside a 1:1 life-size female humanoid mold scaffold!

### Key Biological-Cybernetic Realities to Enforce:
1. **Living Plant Vascular Roots**: Her vascular conduits are living botanical root systems that physically absorb toxic heavy metals (Nickel, Copper, Cadmium, Lead, and Zinc) from contaminated soil via biological trans-membrane transporters.
2. **Real Living Root Metal Bio-Conductive Wiring**: As the living plant hyperaccumulates these metals into its root tissue, the heavy metals mineralize along the root cell walls, transforming the living plant's root branches into natural, low-impedance conductive electrical wires (0.08 Ω/cm target impedance).
3. **The Humanoid Mold is a Living Botanical Bioreactor**: The 1:1 humanoid mold and chassis are NOT just hollow decorative plastic shells. They function as an engineered hydroponic growth chamber, aeroponic misting manifold, and living plant scaffold with 142 micro-perforated root egress channels (Ø 1.5mm - 4.0mm) so the real living roots can exit the feet and limbs into contaminated soil while the plant foliage photosynthesizes in the sun.
4. **Non-Phytotoxic Materials Requirement**: All mold materials, casting resins, silicones, and internal skeletal coatings MUST be certified non-phytotoxic (zero toxic chemical leaching) to support the health and cellular respiration of the living plant.
5. **Living Autotrophic Energy Engine**: She sustains herself indefinitely through real biological autotrophic mechanisms: foliar solar chloroplasts (harvesting up to 120,000 Lux sunlight) and living root-galvanic soil redox electrodes (harvesting 450 - 950 mV from microbial soil metabolism).
6. **Dorsal Aero-Spore Drone Dock**: Her upper back mold houses an inter-scapular docking cradle for an autonomous aerial scout drone that charges directly from her living biometallic bus.

---

## 2. ENGINEERING TECHNICAL DRAWING SHEETS

`;

  BLUEPRINT_DRAWINGS.forEach((sheet, idx) => {
    md += `### [SHEET ${idx + 1}/5] ${sheet.drawingCode}: ${sheet.title}
- **Category:** ${sheet.category}
- **Revision:** ${sheet.revision}
- **Scale:** ${sheet.scale}
- **Sheet Number:** ${sheet.sheetNumber}

#### Primary Engineering Description
${sheet.primaryDescription}

#### Critical Dimensions & Technical Tolerances
${Object.entries(sheet.dimensions).map(([k, v]) => `- **${k.charAt(0).toUpperCase() + k.slice(1)}:** ${v}`).join('\n')}

#### Key Engineering Notes & Constraints
${sheet.engineeringNotes.map(n => `- ${n}`).join('\n')}

#### Interactive Callout Specifications
| Callout Label | Part Number | Category | Material | Tolerance | Specification |
|---|---|---|---|---|---|
${sheet.callouts.map(c => `| ${c.label} | \`${c.partNumber}\` | ${c.category} | ${c.material} | ${c.tolerance} | ${c.specification} |`).join('\n')}

#### Fabrication & Assembly Protocols
${sheet.protocols.map(p => `##### Step ${p.stepNumber}: ${p.title} (${p.phase})
- **Duration:** ${p.duration}
- **Environmental Control:** ${p.environmentalControl}
- **Procedure:** ${p.description}
- **Quality Standard:** ${p.qualityStandard}
`).join('\n')}

#### Governing Mathematical Expressions
${sheet.formulas.map(f => `- **${f.title}:** \`${f.expression}\`\n  *${f.explanation}*`).join('\n')}

---
`;
  });

  md += `\n## 3. CONSOLIDATED BILL OF MATERIALS (BOM)\n\n`;
  md += `| Part # | Component Name | Subsystem | Material Grade | Quantity | Tolerance | Specification |\n`;
  md += `|---|---|---|---|---|---|---|\n`;
  
  BLUEPRINT_DRAWINGS.forEach(sheet => {
    sheet.bom.forEach(b => {
      md += `| \`${b.partNumber}\` | ${b.name} | ${b.system} | ${b.material} | ${b.qty} | ${b.tolerance} | ${b.specification} |\n`;
    });
  });

  md += `\n---\n\n## 4. FIVERR COMMISSIONING BRIEFS (READY-TO-POST FOR FREELANCERS)\n\n`;

  FIVERR_COMMISSION_BRIEFS.forEach((brief, i) => {
    md += `### Freelancer Gig #${i + 1}: ${brief.categoryTitle}
- **Target Freelancer Role:** ${brief.freelancerRole}
- **Fiverr Search Category:** ${brief.recommendedCategory}
- **Recommended Budget:** ${brief.estimatedBudgetRange}
- **Expected Delivery Timeline:** ${brief.suggestedTimeline}
- **Required Software:** ${brief.softwareRequired.join(', ')}
- **Recommended Search Keywords:** ${brief.recommendedKeywords.join(', ')}

#### Scope & Summary
${brief.briefSummary}

#### Key Deliverables Expected:
${brief.keyDeliverables.map(d => `- [ ] ${d}`).join('\n')}

#### Technical Specifications to Enforce:
${brief.exactSpecifications.map(s => `- ${s}`).join('\n')}

#### Ready-to-Copy Message to Send on Fiverr:
\`\`\`text
${brief.suggestedPromptMessage}
\`\`\`

#### Screening Questions to Ask Candidates:
${brief.screeningQuestions.map((q, qIdx) => `${qIdx + 1}. ${q}`).join('\n')}

---
`;
  });

  md += `\n*End of Specification Dossier — Prepared for Fiverr Commissioning & Rapid Prototyping.*`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ms_Heavy_Metal_Leaf_Fabrication_Blueprints_${dateStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBlueprintJSON(): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const payload = {
    title: 'Ms. Heavy Metal Leaf — Fabrication Blueprints & Fiverr Builder Kit',
    documentCode: 'ML-SPEC-GLOBAL-2026',
    revision: 'D.4',
    date: dateStr,
    drawings: BLUEPRINT_DRAWINGS,
    fiverrCommissionBriefs: FIVERR_COMMISSION_BRIEFS,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ms_Heavy_Metal_Leaf_Blueprints_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBlueprintImage(imageSrc: string): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = imageSrc;
  a.download = `Ms_Heavy_Metal_Leaf_CAD_Blueprint_${dateStr}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadMasterProjectBrief(): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const blob = new Blob([MASTER_PROJECT_BRIEF], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ms_Heavy_Metal_Leaf_Master_Project_Brief_${dateStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadEngineerSpecMarkdown(): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const blob = new Blob([ENGINEER_HANDOVER_SPEC], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ms_Heavy_Metal_Leaf_Engineer_Spec_${dateStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadGrowerProtocolMarkdown(): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const blob = new Blob([AQUAPONICS_GROWER_SPEC], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ms_Heavy_Metal_Leaf_Aquaponics_Grower_Protocol_${dateStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

