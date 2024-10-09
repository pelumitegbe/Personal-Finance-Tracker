import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

const categories = ["All", "Food", "Transportation", "Housing", "Utilities", "Entertainment", "Healthcare", "Education", "Other"];

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full">
      <Select onValueChange={onCategoryChange} defaultValue="All">
        <SelectTrigger className="w-full border-2 border-black rounded-lg">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-black rounded-md shadow-lg z-50">
          {categories.map((category) => (
            <SelectItem key={category} value={category} className="hover:bg-gray-100">
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}