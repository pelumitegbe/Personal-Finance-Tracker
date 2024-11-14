import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategory } from "../../hooks/category";
import { Category } from "../../interface";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}


export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  
  const categories: Category[] = useCategory();

  return (
    <div className="w-full">
      <Select onValueChange={onCategoryChange} defaultValue="All">
        <SelectTrigger className="bg-white w-full border-2 border-grey rounded-lg p-1">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-grey rounded-md shadow-lg z-50">
        <SelectItem value="All" className="hover:bg-gray-100">
              All
            </SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.name} className="hover:bg-gray-100">
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}