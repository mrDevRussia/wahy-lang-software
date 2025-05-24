#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Wahy Programming Language Interpreter
=====================================

A simple Arabic programming language for generating HTML pages.
Created for educational purposes to help Arabic speakers learn web development.

Author: Wahy Language Team
License: MIT
"""

import sys
import json
import re
from typing import Dict, List, Optional, Tuple
from commands import WahyCommands
from html_generator import HTMLGenerator

class WahyInterpreter:
    """Main interpreter class for the Wahy programming language."""
    
    def __init__(self):
        self.commands = WahyCommands()
        self.html_generator = HTMLGenerator()
        self.current_line = 0
        self.errors = []
        
    def parse_command(self, line: str) -> Optional[Tuple[str, List[str]]]:
        """
        Parse a single line of Wahy code into command and arguments.
        
        Args:
            line (str): A line of Wahy code
            
        Returns:
            Optional[Tuple[str, List[str]]]: (command, arguments) or None if invalid
        """
        line = line.strip()
        if not line or line.startswith('#'):
            return None
            
        # Extract quoted strings
        quotes_pattern = r'"([^"]*)"'
        quoted_strings = re.findall(quotes_pattern, line)
        
        # Remove quoted strings temporarily for command parsing
        temp_line = re.sub(quotes_pattern, '___QUOTED___', line)
        
        # Split the line into words
        words = temp_line.split()
        
        if not words:
            return None
            
        # Reconstruct command by replacing placeholders with actual quotes
        quote_index = 0
        for i, word in enumerate(words):
            if word == '___QUOTED___':
                if quote_index < len(quoted_strings):
                    words[i] = quoted_strings[quote_index]
                    quote_index += 1
                else:
                    words[i] = ""
        
        # Determine command and arguments
        if len(words) >= 2 and words[1] in ['صفحة', 'عنوان', 'فقرة', 'رابط', 'صورة', 'عنصر']:
            command = ' '.join(words[:2])
            args = words[2:]
        elif len(words) >= 3 and words[0] == 'غيّر':
            command = ' '.join(words[:3])
            args = words[3:]
        elif words[0] in ['ابدأ', 'أنهِ']:
            command = ' '.join(words[:2]) if len(words) >= 2 else words[0]
            args = words[2:] if len(words) > 2 else []
        else:
            command = words[0]
            args = words[1:]
            
        return command, args
    
    def interpret_file(self, filepath: str) -> Dict:
        """
        Interpret a Wahy file and generate HTML.
        
        Args:
            filepath (str): Path to the Wahy file
            
        Returns:
            Dict: Result containing success status, HTML, or error information
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                lines = file.readlines()
                
            return self.interpret_code(lines)
            
        except FileNotFoundError:
            return {
                'success': False,
                'error': f'ملف غير موجود: {filepath}',
                'lineNumber': 0
            }
        except UnicodeDecodeError:
            return {
                'success': False,
                'error': 'خطأ في ترميز الملف. تأكد من استخدام UTF-8',
                'lineNumber': 0
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'خطأ غير متوقع: {str(e)}',
                'lineNumber': 0
            }
    
    def interpret_code(self, lines: List[str]) -> Dict:
        """
        Interpret Wahy code lines and generate HTML.
        
        Args:
            lines (List[str]): List of code lines
            
        Returns:
            Dict: Result containing success status, HTML, or error information
        """
        self.current_line = 0
        self.errors = []
        self.html_generator.reset()
        
        for i, line in enumerate(lines):
            self.current_line = i + 1
            
            parsed = self.parse_command(line)
            if parsed is None:
                continue
                
            command, args = parsed
            
            try:
                if not self.commands.execute_command(command, args, self.html_generator):
                    error_msg = f'أمر غير معروف: {command}'
                    return {
                        'success': False,
                        'error': error_msg,
                        'lineNumber': self.current_line
                    }
            except Exception as e:
                return {
                    'success': False,
                    'error': f'خطأ في السطر {self.current_line}: {str(e)}',
                    'lineNumber': self.current_line
                }
        
        # Validate that the page was properly closed
        if not self.html_generator.is_page_complete():
            return {
                'success': False,
                'error': 'الصفحة لم يتم إغلاقها بشكل صحيح. استخدم "أغلق صفحة"',
                'lineNumber': len(lines)
            }
        
        html_output = self.html_generator.get_html()
        
        return {
            'success': True,
            'html': html_output
        }

def main():
    """Main function to run the interpreter from command line."""
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'الاستخدام: python wahy_interpreter.py <ملف_الكود>'
        }))
        sys.exit(1)
    
    filepath = sys.argv[1]
    interpreter = WahyInterpreter()
    result = interpreter.interpret_file(filepath)
    
    print(json.dumps(result, ensure_ascii=False, indent=2))
    
    if not result['success']:
        sys.exit(1)

if __name__ == '__main__':
    main()
