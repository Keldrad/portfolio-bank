import { el, setChildren } from 'redom';

export default function createSubheader() {
  const subheader = el('.subheader-container');
  const left = el('.subheader__left');
  const right = el('.subheader__right');

  setChildren(subheader, [left, right]);
  return subheader;
}
