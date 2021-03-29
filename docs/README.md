gedcom

# gedcom

## Table of contents

### Functions

- [compact](README.md#compact)
- [parse](README.md#parse)
- [toD3Force](README.md#tod3force)
- [toDot](README.md#todot)
- [toGraphlib](README.md#tographlib)
- [tokenize](README.md#tokenize)

## Functions

### compact

▸ **compact**(`root`: Parent, `removeNodes?`: *string*[]): Parent

This applies an opinionated transformation to GEDCOM data,
making it easier for common use cases. In the raw GEDCOM
AST, attributes like birth years are represented as nodes.
This transformation compresses those attributes into properties
of a node’s `.data` member.

Here's how this transformation works:

For example, let's say you have this content:

```
0 INDI
  1 BIRT
    2 DATE 12 MAY 1920
  1 DEAT
    2 DATE 1960
```

The output of `parse` will create nodes for the INDI, BIRT, DATE,
DEAT, and DATE objects. If you simply want to ask 'when was this individual
alive?' This can be a difficult question to answer. Compact will transform
those nodes into a simplified form:

```js
 {
  type: "INDI",
  data: {
    formal_name: "INDIVIDUAL",
    "BIRTH/DATE": "12 MAY 1920",
    "DEATH/DATE": "1960",
  },
  value: undefined,
  children: [],
}
```

If there are multiple values for something like a birth date, they'll be
included in an additional property with a `+`:

{
  "BIRTH/DATE": "12 MAY 1920",
  "+BIRTH/DATE": ["13 MAY 1920"],
}

This also removes nodes from the syntax tree that are unlikely
to have any use for genealogical or visualization applications.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`root` | Parent | - | a parsed GEDCOM document   |
`removeNodes` | *string*[] | ... | a list of nodes that should be removed.   |

**Returns:** Parent

the same document, with attributes compacted.

Defined in: [unist-compact.ts:66](https://github.com/tmcw/gedcom/blob/1e5d589/lib/unist-compact.ts#L66)

___

### parse

▸ **parse**(`input`: *string*): Parent

Parse a string of GEDCOM data into an unist-compatible
abstract syntax tree. This is the core function for transforming
GEDCOM into JSON data that captures all of its detail, but
for practical usage you may also want to run `compact`
on the generated syntax tree to compress attributes.

**Note**: the AST format uses 'children' to indicate the children
of abstract syntax tree nodes, but these are not equivalent to
parent/child relationships in family data.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`input` | *string* | GEDCOM data as a string   |

**Returns:** Parent

ast

Defined in: [parse-to-unist.ts:52](https://github.com/tmcw/gedcom/blob/1e5d589/lib/parse-to-unist.ts#L52)

___

### toD3Force

▸ **toD3Force**(`root`: Parent): ForceData

Transforms a GEDCOM AST - likely produced using
`parse` - into a data structure suited for
a [D3 force directed graph](https://observablehq.com/@d3/force-directed-graph)
layout.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`root` | Parent | Parsed GEDCOM content   |

**Returns:** ForceData

D3-friendly JSON

Defined in: [to-d3-force.ts:41](https://github.com/tmcw/gedcom/blob/1e5d589/lib/to-d3-force.ts#L41)

___

### toDot

▸ **toDot**(`root`: Parent): *string*

Transforms a GEDCOM AST - likely produced using
`parse` - into a [Graphviz DOT](https://graphviz.org/doc/info/lang.html)
language file.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`root` | Parent | Parsed GEDCOM content   |

**Returns:** *string*

DOT-formatted graph

Defined in: [to-dot.ts:13](https://github.com/tmcw/gedcom/blob/1e5d589/lib/to-dot.ts#L13)

___

### toGraphlib

▸ **toGraphlib**(`root`: Parent): Graph

Transforms a GEDCOM AST into a [Graphlib](https://github.com/dagrejs/graphlib)
Graph object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`root` | Parent | Parsed GEDCOM content   |

**Returns:** Graph

graphviz Graph object

Defined in: [to-graphlib.ts:12](https://github.com/tmcw/gedcom/blob/1e5d589/lib/to-graphlib.ts#L12)

___

### tokenize

▸ **tokenize**(`buf`: *string*): Line

Lowest-level API to parse-gedcom: parses a single line
of GEDCOM into its constituent tag, level, xref_id,
and so on. It's unlikely that external applications would use this API.
Instead they will more often use `parse`.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`buf` | *string* | One line of GEDCOM data as a string   |

**Returns:** Line

a line object.

Defined in: [tokenize.ts:38](https://github.com/tmcw/gedcom/blob/1e5d589/lib/tokenize.ts#L38)
