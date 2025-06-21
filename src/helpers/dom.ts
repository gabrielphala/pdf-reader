export const get1ByClass = (className: string) => {
  const els = document.getElementsByClassName(className);

  return els ? els[0] : null;
};

export const $valueid = (id: string) => {
  return (document.getElementById(id) as HTMLInputElement)?.value;
};

export const $checkedid = (id: string) => {
  return (document.getElementById(id) as HTMLInputElement)?.checked;
};

export const $id = (id: string) => {
  return document.getElementById(id) as HTMLInputElement;
};

export const $cls = (cls: string) => document.getElementsByClassName(cls);
