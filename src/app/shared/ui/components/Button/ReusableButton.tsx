import { Button } from "./Button";
import { Search, X } from "lucide-react";

export const SearchButton = ({ onClick, title = "Search" }) => (
  <Button onClick={onClick} shape="circle" color="primary" size="md" title={title} iconSize={45} leftIcon={Search} />
);

export const ClearButton = ({ onClick, title = "Clear" }) => (
  <Button onClick={onClick} shape="circle" color="danger" size="md" iconSize={35} title={title} leftIcon={X} />
);
