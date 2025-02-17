import React, { JSX } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define different text types
const textTypes = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    caption: 'text-sm text-gray-500',
};

type TypographyProps = {
    as?: keyof JSX.IntrinsicElements;  
    className?: string;               
    children: React.ReactNode;         
    type?: 'h1' | 'h2' | 'h3' | 'p' | 'caption';
};

const Typography = ({ as = 'p', className = '', children, type = 'p', ...props }: TypographyProps) => {
    const Component = as;

    // Merge custom classes with the type's default and add `text-white` if no color is provided
    const mergedClassNames = twMerge(
        clsx(textTypes[type], className)
    );

    return (
        <Component className={mergedClassNames} {...props}>
            {children}
        </Component>
    );
};

export default Typography;
