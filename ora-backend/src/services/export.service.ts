import puppeteer from "puppeteer";
import ExcelJS from "exceljs";
import path from "path";

import { PrismaClient } from "@prisma/client";
export class ExportService {
  static async computeDataForExport( formationId: string, versionIdOfFormation: string): Promise<any> {
    try {
      const prisma = new PrismaClient();
      const formation = await prisma.formation.findUnique({
        where: { id: Number.parseInt(formationId) },
        include: {
          version: {
            where: { id: Number.parseInt(versionIdOfFormation) },
            include: {
              periodes: {},
              element_constitutifs: true,
              bloc_de_competences: {
                include: {
                  competences: true,
                  element_constitutif: true,
                  importation_mutualisation: true,
                  parcours: true,
                  groupe_ec: true,
                  apprentissage_critiques: true,
                },
              },
              importation_mutualisation_bcc: true,
              competences: {
                include: {
                  niveau: {
                    include: {
                      apprentissage_critique: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return formation;
    } catch (error) {
      throw new Error("Invalid JSON data");
    }
  }

static async generateExcel(
  formationID: string,
  versionID: string,
): Promise<string> {
  let downloadURL = "";
  try {
    const workbook = new ExcelJS.Workbook();
    const formation = await this.computeDataForExport(formationID, versionID);

    if (!formation) {
      throw new Error("Formation not found");
    }

    const niveauxSet = new Map<string, any>();

    formation.version.forEach((version: any) => {
      version.competences.forEach((competence: any) => {
        competence.niveau.forEach((niveau: any) => {
          if (!niveauxSet.has(niveau.libelle)) {
            niveauxSet.set(niveau.libelle, niveau);
          }
        });
      });
    });

    const niveauxUniques = Array.from(niveauxSet.values());

    console.log(formation.version[0]);
    // Feuille par bloc de compétences
    formation.version[0].bloc_de_competences.forEach((blocCompetence: any) => {
      const sheet = workbook.addWorksheet(`Bloc - ${blocCompetence.libelle}`);

      for (let row = 0; row < 4; row++) {
        const excelRow = sheet.getRow(row + 1);
        for (let col = 1; col <= 6; col++) {
          excelRow.getCell(col).value = '';
        }
        excelRow.commit();
      }
      // Fusionner les 6 colonnes sur 4 lignes pour le titre du bloc
      sheet.mergeCells(1, 1, 4, 6);
      sheet.getCell(1, 1).value = blocCompetence.libelle;
      sheet.getCell(1, 1).alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.getCell(1, 1).font = { bold: true, size: 16 };

      sheet.columns = [
        { header: 'Bloc de Compétences', key: 'bloc_libelle', width: 30 },
        { header: 'Compétence', key: 'competence_libelle', width: 30 },
        { header: 'Niveau de développement', key: 'niveau_developpement', width: 25 },
        { header: 'Apprentissage Critique', key: 'apprentissage_critique', width: 40 },
        { header: 'Période', key: 'periode', width: 15 },
        { header: 'UE (Facultatif)', key: 'ue_facultatif', width: 20 },
        { header: 'UE Choix/Obligatoire', key: 'ue_choix_obligatoire', width: 25 },
        { header: 'ECTS UE', key: 'ects', width: 15 },
        { header: 'Libellé Enseignement', key: 'enseignement_libelle', width: 35 },
        { header: 'Typologie Pédagogique', key: 'typologie', width: 25 },
        { header: 'Type Évaluation', key: 'evaluation', width: 20 },
        { header: 'Volume Horaire Encadré', key: 'volume_horaire', width: 25 },
        { header: 'Volume à Comptabiliser (si choix)', key: 'volume_choix', width: 30 },
        { header: 'Charge Travail Étudiant', key: 'charge_travail', width: 25 },
        { header: 'Autre BCC Associé', key: 'bcc_associe', width: 30 },
      ];

      // Ligne 8 : titres dans les cellules
      const headerRow = sheet.getRow(8);
      sheet.columns.forEach((col, idx) => {
        headerRow.getCell(idx + 1).value = Array.isArray(col.header) ? col.header.join(', ') : (col.header ?? '');
        headerRow.getCell(idx + 1).font = { bold: true };
        headerRow.getCell(idx + 1).alignment = { vertical: 'middle', horizontal: 'center' };
      });
      headerRow.commit();

      blocCompetence.competences.forEach((competence: any) => {
        niveauxUniques?.forEach((niveau: any) => {
          niveau.apprentissage_critique?.forEach((ac: any) => {
            ac.enseignements?.forEach((enseignement: any) => {
              sheet.addRow({
                bloc_libelle: blocCompetence.libelle,
                competence_libelle: competence.libelle,
                niveau_developpement: niveau.libelle,
                apprentissage_critique: ac.libelle,
                periode: enseignement.periodes?.join(', ') || '',
                ue_facultatif: enseignement.ue?.facultatif ? 'Oui' : 'Non',
                ue_choix_obligatoire: enseignement.ue?.choix_obligatoire || '',
                ects: enseignement.ue?.ects || '',
                enseignement_libelle: enseignement.libelle || '',
                typologie: enseignement.typologie_pedagogique || '',
                evaluation: enseignement.type_evaluation || '',
                volume_horaire: enseignement.volume_horaire_encadre || '',
                volume_choix: enseignement.volume_choix_comptabiliser || '',
                charge_travail: enseignement.charge_travail_etudiant || '',
                bcc_associe: enseignement.autre_bcc_associe || '',
              });
            });
          });
        });
      });
    });

    // Feuille récapitulative de la formation
    const sheet = workbook.addWorksheet("Formation");
    sheet.columns = [
      { header: 'Titre', key: 'titre', width: 40 },
      { header: 'Description', key: 'description', width: 60 },
    ];
    sheet.addRow({
      titre: formation.titre,
      description: formation.description || '',
    });

    // Enregistrement du fichier
    const filePath = path.join('output.xlsx');
    await workbook.xlsx.writeFile(filePath);
    downloadURL = filePath;

  } catch (error: any) {
    throw new Error("Error generating Excel file: " + error.message);
  }

  return downloadURL;
}


  static async generatePDF(
    formationID: string,
    versionID: string,
  ): Promise<string> {
    try {
      let downloadURL = "";

      const formation = await this.computeDataForExport(
        formationID,
        versionID,
      );
      if (!formation) {
        throw new Error("Formation not found");
      }

      const libelle = formation.libelle;

      console.log(formation);
      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true, // ou 'new' selon ta version
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // utile dans Docker
      });

      const page = await browser.newPage();

      const niveauxSet = new Map<string, any>();

      formation.version.forEach((version: any) => {
        version.competences.forEach((competence: any) => {
          competence.niveau.forEach((niveau: any) => {
            if (!niveauxSet.has(niveau.libelle)) {
              niveauxSet.set(niveau.libelle, niveau);
            }
          });
        });
      });

      const niveauxUniques = Array.from(niveauxSet.values());

      console.log(formation.version[0].bloc_de_competences);
      console.log(
        formation.version[0].bloc_de_competences[0].element_constitutif[0],
      );

      await page.setContent(
        `
            <html>
            <head>
                    <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1, h2 { color: #333; }
                    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background: #f5f5f5; }
                    </style>
            </head>
            <body>
                    <h1>Formation : ${formation.libelle}</h1>
                    ${formation.version[0].bloc_de_competences
                      .map(
                        (bcc: any) => `
                      <h2>Bloc de connaissances et de compétences : ${bcc.libelle}</h2>
                      <h3>Compétences appelées :</h3>
                      <ul>
                          ${bcc.competences
                            .map(
                              (competence: any) => `
                              <li>${competence.libelle}</li>
                          `,
                            )
                            .join("")}
                      </ul>
                      <table>
                          <tr>
                              <th>Niveaux de développement</th>
                              <th>Apprentissages Critiques</th>
                              <th>Périodes</th>
                              <th>UE (facultatif)</th>
                              <th>UE à choix ou obligatoire</th>
                              <th>Nombre ECTS du BCC par UE</th>
                              <th>Libellé de l'enseignement associé au niveau du BCC</th>
                              <th>Typologie pédagogique</th>
                              <th>Type d'évaluation</th>
                              <th>Volume horaire encadré étudiant</th>
                              <th>Si UE à choix, volume horaire à comptabiliser (O/N)</th>
                              <th>Charge de travail étudiant</th>
                              <th>Autre BCC auquel l'enseignement est associé</th>                          
                          </tr>
                          ${niveauxUniques
                            .map(
                              (niveau: any) => `
                                      <tr>
                                          <td>${niveau.libelle}</td>
                                          <td>
                                              <table>
                                                  <tr>
                                                      <th>Libellé</th>
                                                  </tr>
                                                  ${
                                                    bcc.apprentissage_critiques &&
                                                    bcc.apprentissage_critiques
                                                      .length > 0
                                                      ? bcc.apprentissage_critiques
                                                          .map(
                                                            (ac: any) => `
                                                                          <tr>
                                                                              <td>${ac.libelle}</td>
                                                                          </tr>
                                                                      `,
                                                          )
                                                          .join("")
                                                      : `<tr><td>Aucun apprentissage critique</td></tr>`
                                                  }
                                              </table>
                                          </td>
                                      </tr>
                                  `,
                            )
                            .join("")}
                      </table>
                      <div style="page-break-after: always;"></div>
                      `,
                      )
                      .join("")}
            </body>
            </html>
        `,
        { waitUntil: "domcontentloaded" },
      );

      await page.pdf({ path: "output.pdf", format: "A4", landscape: true });
      await browser.close();

      return downloadURL;
    } catch (error: any) {
      throw error;
    }
    return "";
  }
}
