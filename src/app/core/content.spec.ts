import {
  NAV_ITEMS,
  PROCESS_STEPS,
  PROJECTS,
  SERVICES,
  TECH_CATEGORIES,
  TECHNOLOGIES,
} from './content';

const unique = (values: readonly string[]) => new Set(values).size === values.length;

describe('site content', () => {
  it('uses unique identifiers', () => {
    expect(unique(NAV_ITEMS.map((n) => n.id))).toBe(true);
    expect(unique(SERVICES.map((s) => s.number))).toBe(true);
    expect(unique(PROCESS_STEPS.map((s) => s.number))).toBe(true);
    expect(unique(PROJECTS.map((p) => p.number))).toBe(true);
    expect(unique(TECHNOLOGIES.map((t) => t.name))).toBe(true);
  });

  it('assigns every technology to a listed category', () => {
    for (const tech of TECHNOLOGIES) {
      expect(TECH_CATEGORIES).toContain(tech.category);
    }
  });

  it('marks every project as conceptual until real cases exist', () => {
    for (const project of PROJECTS) {
      expect(project.category).toContain('Concepto');
    }
  });
});
