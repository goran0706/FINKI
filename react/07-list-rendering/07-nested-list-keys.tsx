/**
 * Nested List Keys
 * ================
 *
 * Rendering nested lists requires maintaining key uniqueness within each list's immediate sibling scope.
 * React evaluates reconciliation keys locally per child array; keys do not need to be globally unique across
 * different hierarchy levels or separate parent containers.
 *
 * Each nested mapping context creates an independent key scope. Assigning unique keys at both the parent level
 * and child level ensures Virtual DOM diffing can independently reconcile parent list structural shifts
 * and nested child collection updates.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SubItem {
  readonly id: string;
  readonly name: string;
}

export interface Category {
  readonly id: string;
  readonly title: string;
  readonly subItems: ReadonlyArray<SubItem>;
}

export interface SubItemListProps {
  readonly subItems: ReadonlyArray<SubItem>;
}

export interface CategoryListProps {
  readonly categories: ReadonlyArray<Category>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SubItemList: React.FC<SubItemListProps> = (props) => {
  const { subItems } = props;

  return (
    <div>
      {subItems.map((subItem: SubItem) => (
        <p key={subItem.id}>
          Sub-item ({subItem.id}): {subItem.name}
        </p>
      ))}
    </div>
  );
};

export const CategoryList: React.FC<CategoryListProps> = (props) => {
  const { categories } = props;

  return (
    <div>
      {categories.map((category: Category) => (
        <div key={category.id}>
          <h3>
            Category ({category.id}): {category.title}
          </h3>
          <SubItemList subItems={category.subItems} />
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const NestedListKeysContainer: React.FC = () => {
  const categories: ReadonlyArray<Category> = [
    {
      id: "cat-100",
      title: "Frontend Engineering",
      subItems: [
        { id: "sub-1", name: "React Basics" },
        { id: "sub-2", name: "TypeScript Types" },
      ],
    },
    {
      id: "cat-200",
      title: "Backend Engineering",
      subItems: [
        { id: "sub-1", name: "Node.js Architecture" },
        { id: "sub-2", name: "Database Design" },
      ],
    },
  ];

  return (
    <div>
      <h1>Nested List Keys</h1>

      <h2>Independent Key Scopes</h2>
      <CategoryList categories={categories} />
    </div>
  );
};

export default NestedListKeysContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Sibling Scope Isolation: Keys only need to be unique among immediate siblings in a specific mapped array.
// - Nested Re-use Permissibility: Identical key values (`sub-1`) across separate parent arrays do not collide.
// - Parent Key Responsibility: Top-level parent mapping must supply stable keys for outer container elements.
// - Granular Reconciliation: Decouples parent node reordering from child subtree DOM diffing operations.
// - Dedicated Line Destructuring: Enforces single-property line breaks during prop destructuring inside bodies.
