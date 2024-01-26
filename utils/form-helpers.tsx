import isEmpty from 'lodash.isempty';
import { type ReactNode } from 'react';
import {
    type FieldError,
    FieldErrors,
    FieldErrorsImpl,
    Merge,
} from 'react-hook-form';

export type FormValues = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    [key: string]: string; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings. This allows you to access properties using a string key.
};

export type AuthorValues = {
    metaTitle: string;
    metaDescription: string;
    name: string;
    slug: string;
    bio: string;
    image: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};
export type CategoryValues = {
    metaTitle: string;
    metaDescription: string;
    name: string;
    slug: string;
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};
export type TagValues = {
    metaTitle: string;
    metaDescription: string;
    name: string;
    slug: string;
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};
export type SkillValues = {
    metaTitle: string;
    metaDescription: string;
    name: string;
    slug: string;
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};
export type TechnologyValues = {
    metaTitle: string;
    metaDescription: string;
    name: string;
    slug: string;
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};
export type BlogValues = {
    metaTitle: string;
    metaDescription: string;
    title: string;
    slug: string;
    description: string;
    body: string;
    tags: string[];
    author: string;
    category: string;
    image: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};
export type ProjectValues = {
    metaTitle: string;
    metaDescription: string;
    title: string;
    slug: string;
    description: string;
    cover_image: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    mockup_image: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    body: string;
    skills: string[];
    technologies: string[];
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    primary_font: string;
    secondary_font: string;
    accent_font: string;
    project_type: string;
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};
export type PageValues = {
    metaTitle: string;
    metaDescription: string;
    slug: string;
    body: string;
    [key: string]: string | object; // In this code, [key: string]: string; is an index signature. It tells TypeScript that FormValues can have any number of additional properties, as long as their keys are strings and their values are also strings or objects. This allows you to access properties using a string key.
};

export const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
};

export const isDisabled = ({
    fields,
    errors,
}: {
    fields:
        | FormValues
        | AuthorValues
        | BlogValues
        | CategoryValues
        | TagValues
        | PageValues
        | ProjectValues
        | SkillValues
        | TechnologyValues;
    errors: FieldErrors;
}) => {
    // const disabled =
    //     Object.keys(fields)
    //         .filter((a) => a !== 'phone')
    //         .some((k) => fields[k] === '') ||
    //     !isEmpty(errors) ||
    //     isEmpty(fields);
    const disabled = !isEmpty(errors);
    return disabled;
};

export const renderErrorMessage = (
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
): ReactNode => {
    if (error && error.message) {
        return error.message as ReactNode;
    }
    return null;
};

export const selectFieldsMapping: {
    [key: string]: string;
} = {
    category: 'category_id',
    author: 'author_id',
};

export const haveFieldsChanged = (original: any, fields: any) => {
    const keys = Object.keys(fields);
    const changed = keys.filter((key) => {
        // if (key === 'tags') {
        //     console.log('current:', fields[key]);
        //     console.log('original:', original[key]);
        // }
        //console.log('key:', key);
        //console.log('current:', fields[key]);
        //console.log('original:', original[key]);
        if (selectFieldsMapping[key] && original[key]) {
            return fields[key] !== original[key][selectFieldsMapping[key]];
        }
        return JSON.stringify(fields[key]) !== JSON.stringify(original[key]);
    });
    // console.log('changed:', changed);
    if (changed.length > 0) {
        return true;
    } else {
        return false;
    }
};
export const hasBodyChanged = (current_body: string, data_body: string) => {
    const stringifiedBody = JSON.stringify(current_body);
    const stringifiedDataBody = JSON.stringify(data_body);
    // console.log('stringifiedBody:', stringifiedBody);
    // console.log('stringifiedDataBody:', stringifiedDataBody);
    if (stringifiedBody === stringifiedDataBody) {
        return false;
    } else {
        return true;
    }
};
export const hasImageChanged = (current_image: any, data_image: any) => {
    // console.log('current_image:', current_image);
    // console.log('data_image:', data_image);
    const stringifiedImage = JSON.stringify(current_image);
    const stringifiedDataImage = JSON.stringify(data_image);
    if (stringifiedImage === stringifiedDataImage) {
        return false;
    } else {
        return true;
    }
};
