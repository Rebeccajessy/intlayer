import type { HTMLAttributes, MouseEvent } from 'react';
import { styled } from 'styled-components';
import tw from 'twin.macro';

const styledHeading = tw`relative scroll-m-8 scroll-p-8 after:content-['#'] after:scale-75 after:px-6 after:text-neutral after:absolute after:top-0 after:h-full after:-left-12 after:hover:cursor-pointer dark:after:text-neutral-dark after:absolute after:to-neutral after:md:opacity-0 after:transition-opacity hover:after:opacity-80 after:duration-200 after:delay-100`;

const StyledH1 = tw.h1`mt-10 text-4xl font-bold`;
const StyledH2 = styled.h2(() => [tw`mt-5 text-2xl font-bold`, styledHeading]);
const StyledH3 = styled.h3(() => [tw`mt-3 text-xl font-bold`, styledHeading]);
const StyledH4 = styled.h4(() => [tw`mt-3 text-lg font-bold`, styledHeading]);
const StyledH5 = styled.h5(() => [tw`mt-3 text-base font-bold`, styledHeading]);

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  H: typeof StyledH1;
};
type HeadingType = (props: HeadingProps) => JSX.Element;

const getId = (children: string) =>
  String(children)
    // replace accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // replace spaces
    .replace(/\s+/g, '-')
    .toLowerCase();

const scrolltoHash = (id: string) => {
  const element = document.getElementById(id);
  const offset = 150;
  const y =
    (element?.getBoundingClientRect()?.top ?? 0) + window.scrollY - offset;

  window.scrollTo({ top: y, behavior: 'smooth' });
};

const afterClick = (parentElem: Element, e: MouseEvent<HTMLHeadingElement>) => {
  const parentLeft = parentElem.getBoundingClientRect().left,
    parentTop = parentElem.getBoundingClientRect().top;

  const after = window.getComputedStyle(parentElem, ':after');

  const afterStart = parentLeft + parseInt(after.getPropertyValue('left'), 10),
    afterEnd = afterStart + parseInt(after.width, 10);

  const afterYStart = parentTop + parseInt(after.getPropertyValue('top'), 10),
    afterYEnd = afterYStart + parseInt(after.height, 10);

  const mouseX = e.clientX,
    mouseY = e.clientY;

  const isAfterClicked: boolean =
    mouseX >= afterStart &&
    mouseX <= afterEnd &&
    mouseY >= afterYStart &&
    mouseY <= afterYEnd;

  return isAfterClicked;
};

const HeadingWrapper: HeadingType = ({ H, children, ...props }) => {
  const id = typeof children === 'string' ? getId(children) : undefined;

  const onClick = async (e: MouseEvent<HTMLHeadingElement>) => {
    const { id } = e.currentTarget;

    const isAfterClicker = afterClick(e.currentTarget, e);

    if (isAfterClicker && typeof id === 'string') {
      const urlWithoutHash = window.location.href.split('#')[0];
      const url = `${urlWithoutHash}#${id}`;

      // copy the url to the clipboard
      await navigator.clipboard.writeText(url);

      scrolltoHash(id);
    }
  };

  return (
    <H
      id={id}
      onClick={onClick}
      aria-label={`Click to scroll to section ${id} and copy the link to the clipboard`}
      {...props}
    >
      {children}
    </H>
  );
};

export const H1 = StyledH1;
export const H2 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <HeadingWrapper H={StyledH2} {...props} />
);
export const H3 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <HeadingWrapper H={StyledH3} {...props} />
);
export const H4 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <HeadingWrapper H={StyledH4} {...props} />
);
export const H5 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <HeadingWrapper H={StyledH5} {...props} />
);
