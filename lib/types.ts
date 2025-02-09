import type { Node as UnistNode, Parent as UnistParent } from "unist";

export type GEDCOMData = {
  formal_name?: string;
  value?: string | undefined;
  xref_id?: string | undefined;
  pointer?: string | undefined;
  custom_tag?: boolean | undefined;
} & Record<string, unknown>;

export interface Node extends UnistNode {
  data: GEDCOMData;
  children?: (Parent | Node)[];
}

export interface Parent extends UnistParent {
  data?: GEDCOMData;
  children: (Parent | Node)[];
}
