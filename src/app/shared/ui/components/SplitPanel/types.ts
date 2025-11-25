export interface SplitPanelContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of React elements to be displayed in split panels
   */
  items: React.ReactElement[];
  /**
   * Custom gap between panels in pixels
   * @default 0
   */
  gap?: number;
  /**
   * Whether to show dividers between panels
   * @default true
   */
  showDividers?: boolean;
  /**
   * Panel orientation
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
}
