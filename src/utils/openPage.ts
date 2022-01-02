import formatLink from './formatLink';

/**
 * @des 打开链接
 * @param {string} link
 * @param {string} type _self _blank
 */
export default function openPage(link: string, type: '_self' | '_blank' = '_self') {
  window.open(formatLink(link), type);
}
