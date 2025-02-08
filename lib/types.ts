import { Parent, Node } from "unist";

export type GEDCOMData = {
	formal_name: string;
	value: string | undefined;
	xref_id?: string | undefined;
	pointer?: string | undefined;
	custom_tag?: boolean | undefined;
};

export type P = Parent<Node<GEDCOMData>, GEDCOMData>;
