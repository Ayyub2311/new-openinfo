import React from "react";
import { FactBuilderDescriptionList, FactBuilderDescriptionListProps } from "./FactBuilderDescriptionList";
import { FactBuilderTable, FactBuilderTableProps } from "./FactBuilderTable";

export interface FactBuilderSectionDescriptionList {
  component: "description-list";
  props: FactBuilderDescriptionListProps;
}

export interface FactBuilderSectionTable {
  component: "table";
  props: FactBuilderTableProps<unknown>;
}

export interface FactBuilderSectionRC {
  component: "react-content";
  content: React.ReactNode;
}

type FactBuilderSection = FactBuilderSectionDescriptionList | FactBuilderSectionTable | FactBuilderSectionRC;

export interface FactBuilderProps {
  sections: FactBuilderSection[];
}

export const FactBuilder: React.FC<FactBuilderProps> = ({ sections }) => {
  return (
    <div>
      {sections.map((section, index) => {
        if (section.component === "description-list") {
          return (
            <div key={index} className="mt-10">
              <FactBuilderDescriptionList {...section.props} />
            </div>
          );
        }

        if (section.component === "table") {
          return (
            <div key={index} className="mt-10">
              <FactBuilderTable {...section.props} />
            </div>
          );
        }

        if (section.component === "react-content") {
          return (
            <div key={index} className="mt-10">
              {section.content}
            </div>
          );
        }

        return null; // fallback, should not be hit
      })}
    </div>
  );
};
