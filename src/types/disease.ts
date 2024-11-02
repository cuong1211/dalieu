export interface ContentItem {
    subtitle: string;
    content: string[];
}

export interface SubsectionItem {
    subtitle: string;
    items?: ContentItem[];
    content?: string[];
}

export type SectionContent =
    | string[]              // For type 'list'
    | string                // For type 'text'
    | SubsectionItem[];     // For type 'sections'

export interface Section {
    title: string;
    type: 'text' | 'list' | 'sections';
    content: SectionContent;
}

export interface RelatedDisease {
    id: number;
    name: string;
    description: string;
    image: string;
    routeName: string;
}

export interface Disease {
    id: number;
    name: string;
    category: string;
    image: string;
    sections: Section[];
    relatedDiseases: RelatedDisease[];
}

// Type guards
export const isStringArray = (content: SectionContent): content is string[] => {
    return Array.isArray(content) && content.every(item => typeof item === 'string');
};

export const isSubsectionArray = (content: SectionContent): content is SubsectionItem[] => {
    return Array.isArray(content) && content.every(item =>
        typeof item === 'object' &&
        'subtitle' in item
    );
};

export const hasItems = (subsection: SubsectionItem): boolean => {
    return 'items' in subsection && Array.isArray(subsection.items);
};