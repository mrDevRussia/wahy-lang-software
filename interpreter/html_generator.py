#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML Generator for Wahy Language
===============================

This module handles the generation of HTML output from Wahy commands.
It maintains the HTML structure and provides methods for adding elements.
"""

from typing import List, Optional, Dict

class HTMLGenerator:
    """Generates HTML from Wahy commands."""
    
    def __init__(self):
        self.reset()
    
    def reset(self):
        """Reset the generator to initial state."""
        self.html_parts = []
        self.page_opened = False
        self.page_closed = False
        self.styles = {}
        self.list_stack = []  # Stack to handle nested lists
        self.section_stack = []  # Stack to handle nested sections
    
    def open_page(self, title: str):
        """
        Start a new HTML page.
        
        Args:
            title (str): The page title
        """
        if self.page_opened:
            raise Exception('الصفحة مفتوحة بالفعل')
        
        self.html_parts.append('<!DOCTYPE html>')
        self.html_parts.append('<html lang="ar" dir="rtl">')
        self.html_parts.append('<head>')
        self.html_parts.append('<meta charset="UTF-8">')
        self.html_parts.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.html_parts.append(f'<title>{self._escape_html(title)}</title>')
        self.html_parts.append('<style>')
        self.html_parts.append('body { font-family: "Arial", sans-serif; margin: 20px; padding: 20px; }')
        self.html_parts.append('h1, h2, h3, h4, h5, h6 { color: #333; }')
        self.html_parts.append('p { line-height: 1.6; margin: 10px 0; }')
        self.html_parts.append('ul, ol { margin: 10px 0; padding-right: 20px; }')
        self.html_parts.append('li { margin: 5px 0; }')
        self.html_parts.append('a { color: #007bff; text-decoration: none; }')
        self.html_parts.append('a:hover { text-decoration: underline; }')
        self.html_parts.append('img { max-width: 100%; height: auto; margin: 10px 0; }')
        self.html_parts.append('hr { margin: 20px 0; border: none; border-top: 1px solid #ddd; }')
        self.html_parts.append('.section { margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px; }')
        self.html_parts.append('</style>')
        self.html_parts.append('</head>')
        self.html_parts.append('<body>')
        
        self.page_opened = True
    
    def close_page(self):
        """Close the HTML page."""
        if not self.page_opened:
            raise Exception('لا يوجد صفحة مفتوحة للإغلاق')
        if self.page_closed:
            raise Exception('الصفحة مغلقة بالفعل')
        
        # Close any open lists
        while self.list_stack:
            list_type = self.list_stack.pop()
            if list_type == 'ul':
                self.html_parts.append('</ul>')
            else:
                self.html_parts.append('</ol>')
        
        # Close any open sections
        while self.section_stack:
            self.section_stack.pop()
            self.html_parts.append('</div>')
        
        # Add dynamic styles
        if self.styles:
            self.html_parts.insert(-1, '<style>')
            for selector, properties in self.styles.items():
                style_rules = '; '.join([f'{prop}: {value}' for prop, value in properties.items()])
                self.html_parts.insert(-1, f'{selector} {{ {style_rules}; }}')
            self.html_parts.insert(-1, '</style>')
        
        self.html_parts.append('</body>')
        self.html_parts.append('</html>')
        
        self.page_closed = True
    
    def add_heading(self, text: str, level: int = 1):
        """
        Add a heading to the page.
        
        Args:
            text (str): Heading text
            level (int): Heading level (1-6)
        """
        self._ensure_page_open()
        level = max(1, min(6, level))  # Ensure level is between 1 and 6
        self.html_parts.append(f'<h{level}>{self._escape_html(text)}</h{level}>')
    
    def add_subheading(self, text: str):
        """Add a subheading (h2) to the page."""
        self.add_heading(text, 2)
    
    def add_paragraph(self, text: str):
        """
        Add a paragraph to the page.
        
        Args:
            text (str): Paragraph text
        """
        self._ensure_page_open()
        self.html_parts.append(f'<p>{self._escape_html(text)}</p>')
    
    def add_link(self, text: str, url: str):
        """
        Add a link to the page.
        
        Args:
            text (str): Link text
            url (str): Link URL
        """
        self._ensure_page_open()
        safe_url = self._escape_html(url)
        safe_text = self._escape_html(text)
        self.html_parts.append(f'<a href="{safe_url}">{safe_text}</a>')
    
    def add_image(self, url: str, alt_text: str):
        """
        Add an image to the page.
        
        Args:
            url (str): Image URL
            alt_text (str): Alternative text
        """
        self._ensure_page_open()
        safe_url = self._escape_html(url)
        safe_alt = self._escape_html(alt_text)
        self.html_parts.append(f'<img src="{safe_url}" alt="{safe_alt}">')
    
    def start_list(self):
        """Start an unordered list."""
        self._ensure_page_open()
        self.html_parts.append('<ul>')
        self.list_stack.append('ul')
    
    def start_ordered_list(self):
        """Start an ordered list."""
        self._ensure_page_open()
        self.html_parts.append('<ol>')
        self.list_stack.append('ol')
    
    def end_list(self):
        """End the current list."""
        self._ensure_page_open()
        if not self.list_stack:
            raise Exception('لا توجد قائمة مفتوحة لإنهائها')
        
        list_type = self.list_stack.pop()
        if list_type == 'ul':
            self.html_parts.append('</ul>')
        else:
            self.html_parts.append('</ol>')
    
    def end_ordered_list(self):
        """End the current ordered list (alias for end_list)."""
        self.end_list()
    
    def add_list_item(self, text: str):
        """
        Add an item to the current list.
        
        Args:
            text (str): List item text
        """
        self._ensure_page_open()
        if not self.list_stack:
            raise Exception('لا توجد قائمة مفتوحة لإضافة عنصر إليها')
        
        self.html_parts.append(f'<li>{self._escape_html(text)}</li>')
    
    def add_horizontal_rule(self):
        """Add a horizontal rule."""
        self._ensure_page_open()
        self.html_parts.append('<hr>')
    
    def add_space(self):
        """Add a line break."""
        self._ensure_page_open()
        self.html_parts.append('<br>')
    
    def start_section(self, css_class: Optional[str] = None):
        """
        Start a new section.
        
        Args:
            css_class (Optional[str]): CSS class for the section
        """
        self._ensure_page_open()
        if css_class:
            self.html_parts.append(f'<div class="{self._escape_html(css_class)}>')
        else:
            self.html_parts.append('<div class="section">')
        self.section_stack.append(css_class or 'section')
    
    def end_section(self):
        """End the current section."""
        self._ensure_page_open()
        if not self.section_stack:
            raise Exception('لا يوجد قسم مفتوح لإنهائه')
        
        self.section_stack.pop()
        self.html_parts.append('</div>')
    
    def change_background_color(self, color: str):
        """
        Change the background color of the page.
        
        Args:
            color (str): Background color
        """
        self._ensure_page_open()
        if 'body' not in self.styles:
            self.styles['body'] = {}
        self.styles['body']['background-color'] = color
    
    def change_text_color(self, color: str):
        """
        Change the text color of the page.
        
        Args:
            color (str): Text color
        """
        self._ensure_page_open()
        if 'body' not in self.styles:
            self.styles['body'] = {}
        self.styles['body']['color'] = color
    
    def change_font(self, font: str):
        """
        Change the font family of the page.
        
        Args:
            font (str): Font family
        """
        self._ensure_page_open()
        if 'body' not in self.styles:
            self.styles['body'] = {}
        self.styles['body']['font-family'] = font
    
    def get_html(self) -> str:
        """
        Get the generated HTML.
        
        Returns:
            str: Complete HTML document
        """
        return '\n'.join(self.html_parts)
    
    def is_page_complete(self) -> bool:
        """
        Check if the page is properly opened and closed.
        
        Returns:
            bool: True if page is complete
        """
        return self.page_opened and self.page_closed
    
    def _ensure_page_open(self):
        """Ensure that a page is currently open."""
        if not self.page_opened:
            raise Exception('يجب فتح صفحة أولاً باستخدام "افتح صفحة"')
        if self.page_closed:
            raise Exception('الصفحة مغلقة. لا يمكن إضافة محتوى جديد')
    
    def _escape_html(self, text: str) -> str:
        """
        Escape HTML special characters.
        
        Args:
            text (str): Text to escape
            
        Returns:
            str: Escaped text
        """
        return (text.replace('&', '&amp;')
                   .replace('<', '&lt;')
                   .replace('>', '&gt;')
                   .replace('"', '&quot;')
                   .replace("'", '&#x27;'))
