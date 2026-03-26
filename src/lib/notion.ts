import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  });

  // ============ Types ============
  export interface SiteSetting {
    key: string;
      value: string;
        image?: string;
        }

        export interface UseCase {
          id: string;
            title: string;
              description: string;
                tags: string[];
                  hours: string;
                    lessons: string;
                      coverImage?: string;
                        order: number;
                        }

                        export interface WorkExperience {
                          id: string;
                            company: string;
                              role: string;
                                description: string;
                                  icon?: string;
                                    order: number;
                                    }

                                    export interface CompanyLogo {
                                      id: string;
                                        name: string;
                                          logo?: string;
                                            order: number;
                                            }

                                            // ============ Helpers ============
                                            function getTextProperty(page: any, property: string): string {
                                              const prop = page.properties[property];
                                                if (!prop) return "";
                                                  if (prop.type === "title") {
                                                      return prop.title?.map((t: any) => t.plain_text).join("") || "";
                                                        }
                                                          if (prop.type === "rich_text") {
                                                              return prop.rich_text?.map((t: any) => t.plain_text).join("") || "";
                                                                }
                                                                  return "";
                                                                  }

                                                                  function getNumberProperty(page: any, property: string): number {
                                                                    const prop = page.properties[property];
                                                                      return prop?.number ?? 0;
                                                                      }

                                                                      function getMultiSelectProperty(page: any, property: string): string[] {
                                                                        const prop = page.properties[property];
                                                                          if (!prop || prop.type !== "multi_select") return [];
                                                                            return prop.multi_select.map((s: any) => s.name);
                                                                            }

                                                                            function getFileProperty(page: any, property: string): string | undefined {
                                                                              const prop = page.properties[property];
                                                                                if (!prop || prop.type !== "files" || !prop.files.length) return undefined;
                                                                                  const file = prop.files[0];
                                                                                    if (file.type === "file") return file.file.url;
                                                                                      if (file.type === "external") return file.external.url;
                                                                                        return undefined;
                                                                                        }

                                                                                        // ============ Data Fetchers (with error handling) ============
                                                                                        export async function getSiteSettings(): Promise<Record<string, SiteSetting>> {
                                                                                          try {
                                                                                              const response = await notion.databases.query({
                                                                                                    database_id: process.env.NOTION_SITE_SETTINGS_DB!,
                                                                                                        });
                                                                                                        
                                                                                                            const settings: Record<string, SiteSetting> = {};
                                                                                                                for (const page of response.results as any[]) {
                                                                                                                      const key = getTextProperty(page, "Key");
                                                                                                                            settings[key] = {
                                                                                                                                    key,
                                                                                                                                            value: getTextProperty(page, "Value"),
                                                                                                                                                    image: getFileProperty(page, "Image"),
                                                                                                                                                          };
                                                                                                                                                              }
                                                                                                                                                                  return settings;
                                                                                                                                                                    } catch (error) {
                                                                                                                                                                        console.error("Failed to fetch site settings:", error);
                                                                                                                                                                            return {};
                                                                                                                                                                              }
                                                                                                                                                                              }
                                                                                                                                                                              
                                                                                                                                                                              export async function getUseCases(): Promise<UseCase[]> {
                                                                                                                                                                                try {
                                                                                                                                                                                    const response = await notion.databases.query({
                                                                                                                                                                                          database_id: process.env.NOTION_USE_CASES_DB!,
                                                                                                                                                                                                sorts: [{ property: "Order", direction: "ascending" }],
                                                                                                                                                                                                    });
                                                                                                                                                                                                    
                                                                                                                                                                                                        return (response.results as any[]).map((page) => ({
                                                                                                                                                                                                              id: page.id,
                                                                                                                                                                                                                    title: getTextProperty(page, "Title"),
                                                                                                                                                                                                                          description: getTextProperty(page, "Description"),
                                                                                                                                                                                                                                tags: getMultiSelectProperty(page, "Tags"),
                                                                                                                                                                                                                                      hours: getTextProperty(page, "Hours"),
                                                                                                                                                                                                                                            lessons: getTextProperty(page, "Lessons"),
                                                                                                                                                                                                                                                  coverImage: getFileProperty(page, "Cover Image"),
                                                                                                                                                                                                                                                        order: getNumberProperty(page, "Order"),
                                                                                                                                                                                                                                                            }));
                                                                                                                                                                                                                                                              } catch (error) {
                                                                                                                                                                                                                                                                  console.error("Failed to fetch use cases:", error);
                                                                                                                                                                                                                                                                      return [];
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                        export async function getWorkExperience(): Promise<WorkExperience[]> {
                                                                                                                                                                                                                                                                          try {
                                                                                                                                                                                                                                                                              const response = await notion.databases.query({
                                                                                                                                                                                                                                                                                    database_id: process.env.NOTION_WORK_EXPERIENCE_DB!,
                                                                                                                                                                                                                                                                                          sorts: [{ property: "Order", direction: "ascending" }],
                                                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                  return (response.results as any[]).map((page) => ({
                                                                                                                                                                                                                                                                                                        id: page.id,
                                                                                                                                                                                                                                                                                                              company: getTextProperty(page, "Company"),
                                                                                                                                                                                                                                                                                                                    role: getTextProperty(page, "Role"),
                                                                                                                                                                                                                                                                                                                          description: getTextProperty(page, "Description"),
                                                                                                                                                                                                                                                                                                                                icon: getFileProperty(page, "Icon"),
                                                                                                                                                                                                                                                                                                                                      order: getNumberProperty(page, "Order"),
                                                                                                                                                                                                                                                                                                                                          }));
                                                                                                                                                                                                                                                                                                                                            } catch (error) {
                                                                                                                                                                                                                                                                                                                                                console.error("Failed to fetch work experience:", error);
                                                                                                                                                                                                                                                                                                                                                    return [];
                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                      export async function getCompanyLogos(): Promise<CompanyLogo[]> {
                                                                                                                                                                                                                                                                                                                                                        try {
                                                                                                                                                                                                                                                                                                                                                            const response = await notion.databases.query({
                                                                                                                                                                                                                                                                                                                                                                  database_id: process.env.NOTION_COMPANY_LOGOS_DB!,
                                                                                                                                                                                                                                                                                                                                                                        sorts: [{ property: "Order", direction: "ascending" }],
                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                return (response.results as any[]).map((page) => ({
                                                                                                                                                                                                                                                                                                                                                                                      id: page.id,
                                                                                                                                                                                                                                                                                                                                                                                            name: getTextProperty(page, "Name"),
                                                                                                                                                                                                                                                                                                                                                                                                  logo: getFileProperty(page, "Logo"),
                                                                                                                                                                                                                                                                                                                                                                                                        order: getNumberProperty(page, "Order"),
                                                                                                                                                                                                                                                                                                                                                                                                            }));
                                                                                                                                                                                                                                                                                                                                                                                                              } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                                                                  console.error("Failed to fetch company logos:", error);
                                                                                                                                                                                                                                                                                                                                                                                                                      return [];
                                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                                        }
