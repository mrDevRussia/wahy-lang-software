#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Wahy Language Commands
=====================

This module contains all the available commands for the Wahy programming language.
Each command corresponds to an HTML element or style modification.
"""

from typing import List, Dict, Optional
from html_generator import HTMLGenerator

class WahyCommands:
    """Class containing all Wahy language commands."""
    
    def __init__(self):
        self.command_map = {
            'افتح صفحة': self.open_page,
            'أغلق صفحة': self.close_page,
            'أضف عنوان': self.add_heading,
            'أضف فقرة': self.add_paragraph,
            'أضف رابط': self.add_link,
            'أضف صورة': self.add_image,
            'غيّر لون_الخلفية إلى': self.change_background_color,
            'غيّر لون_النص إلى': self.change_text_color,
            'غيّر الخط إلى': self.change_font,
            'ابدأ قائمة': self.start_list,
            'أنهِ قائمة': self.end_list,
            'أضف عنصر': self.add_list_item,
            'ابدأ قائمة_مرقمة': self.start_ordered_list,
            'أنهِ قائمة_مرقمة': self.end_ordered_list,
            'أضف عنوان_فرعي': self.add_subheading,
            'أضف خط_فاصل': self.add_horizontal_rule,
            'أضف مسافة': self.add_space,
            'ابدأ قسم': self.start_section,
            'أنهِ قسم': self.end_section,
        }
    
    def execute_command(self, command: str, args: List[str], generator: HTMLGenerator) -> bool:
        """
        Execute a Wahy command.
        
        Args:
            command (str): The command to execute
            args (List[str]): Arguments for the command
            generator (HTMLGenerator): HTML generator instance
            
        Returns:
            bool: True if command was executed successfully, False otherwise
        """
        if command in self.command_map:
            try:
                self.command_map[command](args, generator)
                return True
            except Exception as e:
                raise Exception(f'خطأ في تنفيذ الأمر "{command}": {str(e)}')
        return False
    
    def open_page(self, args: List[str], generator: HTMLGenerator):
        """Open a new HTML page with title."""
        if len(args) < 1:
            raise Exception('أمر "افتح صفحة" يحتاج إلى عنوان الصفحة')
        title = args[0]
        generator.open_page(title)
    
    def close_page(self, args: List[str], generator: HTMLGenerator):
        """Close the HTML page."""
        generator.close_page()
    
    def add_heading(self, args: List[str], generator: HTMLGenerator):
        """Add a heading (h1) to the page."""
        if len(args) < 1:
            raise Exception('أمر "أضف عنوان" يحتاج إلى نص العنوان')
        text = args[0]
        generator.add_heading(text)
    
    def add_subheading(self, args: List[str], generator: HTMLGenerator):
        """Add a subheading (h2) to the page."""
        if len(args) < 1:
            raise Exception('أمر "أضف عنوان_فرعي" يحتاج إلى نص العنوان')
        text = args[0]
        generator.add_subheading(text)
    
    def add_paragraph(self, args: List[str], generator: HTMLGenerator):
        """Add a paragraph to the page."""
        if len(args) < 1:
            raise Exception('أمر "أضف فقرة" يحتاج إلى نص الفقرة')
        text = args[0]
        generator.add_paragraph(text)
    
    def add_link(self, args: List[str], generator: HTMLGenerator):
        """Add a link to the page."""
        if len(args) < 2:
            raise Exception('أمر "أضف رابط" يحتاج إلى نص الرابط و URL')
        text = args[0]
        url = args[1]
        generator.add_link(text, url)
    
    def add_image(self, args: List[str], generator: HTMLGenerator):
        """Add an image to the page."""
        if len(args) < 2:
            raise Exception('أمر "أضف صورة" يحتاج إلى URL الصورة ووصف')
        url = args[0]
        alt_text = args[1]
        generator.add_image(url, alt_text)
    
    def change_background_color(self, args: List[str], generator: HTMLGenerator):
        """Change the background color of the page."""
        if len(args) < 1:
            raise Exception('أمر "غيّر لون_الخلفية" يحتاج إلى اسم اللون')
        color = args[0]
        generator.change_background_color(color)
    
    def change_text_color(self, args: List[str], generator: HTMLGenerator):
        """Change the text color of the page."""
        if len(args) < 1:
            raise Exception('أمر "غيّر لون_النص" يحتاج إلى اسم اللون')
        color = args[0]
        generator.change_text_color(color)
    
    def change_font(self, args: List[str], generator: HTMLGenerator):
        """Change the font family of the page."""
        if len(args) < 1:
            raise Exception('أمر "غيّر الخط" يحتاج إلى اسم نوع الخط')
        font = args[0]
        generator.change_font(font)
    
    def start_list(self, args: List[str], generator: HTMLGenerator):
        """Start an unordered list."""
        generator.start_list()
    
    def end_list(self, args: List[str], generator: HTMLGenerator):
        """End an unordered list."""
        generator.end_list()
    
    def start_ordered_list(self, args: List[str], generator: HTMLGenerator):
        """Start an ordered list."""
        generator.start_ordered_list()
    
    def end_ordered_list(self, args: List[str], generator: HTMLGenerator):
        """End an ordered list."""
        generator.end_ordered_list()
    
    def add_list_item(self, args: List[str], generator: HTMLGenerator):
        """Add an item to the current list."""
        if len(args) < 1:
            raise Exception('أمر "أضف عنصر" يحتاج إلى نص العنصر')
        text = args[0]
        generator.add_list_item(text)
    
    def add_horizontal_rule(self, args: List[str], generator: HTMLGenerator):
        """Add a horizontal rule (line separator)."""
        generator.add_horizontal_rule()
    
    def add_space(self, args: List[str], generator: HTMLGenerator):
        """Add a blank space (br tag)."""
        generator.add_space()
    
    def start_section(self, args: List[str], generator: HTMLGenerator):
        """Start a new section (div)."""
        css_class = args[0] if args else None
        generator.start_section(css_class)
    
    def end_section(self, args: List[str], generator: HTMLGenerator):
        """End the current section."""
        generator.end_section()
