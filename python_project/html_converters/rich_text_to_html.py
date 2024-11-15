import sys
import xml.dom.minidom
import re
from PyQt5.QtWidgets import (QApplication, QWidget, QVBoxLayout, QTextEdit, QLabel, QPushButton, QHBoxLayout, QFileDialog, QMessageBox, QSplitter, QTextBrowser)

class RichTextConverter(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        self.setWindowTitle('Rich Text to HTML Converter')
        self.resize(600, 400)

        # Create a vertical layout
        layout = QVBoxLayout()

        # Instruction label
        instruction_label = QLabel('Paste your rich text below:')
        layout.addWidget(instruction_label)

        # Rich text input field
        self.text_edit = QTextEdit()
        layout.addWidget(self.text_edit)

        # Buttons layout
        buttons_layout = QHBoxLayout()

        # Convert button
        convert_button = QPushButton('Convert and Save HTML')
        convert_button.clicked.connect(self.convert_and_save)
        buttons_layout.addWidget(convert_button)

        # Add the buttons layout to the main layout
        layout.addLayout(buttons_layout)

        # Set the layout for the main window
        self.setLayout(layout)
    
    def convert_and_save(self):
    # convierte lo que hay en el campo a html
        html = self.text_edit.toHtml()

        # Step 2: Clean the HTML content

    # Remueve <p>, <span>, and <a> tags
        pattern = r'</?(p|span|a)(\s+[^>]*)?>'
        html = re.sub(pattern, '', html, flags=re.IGNORECASE)

    # Remover espacios demas
        html = ' '.join(html.split())

    # volver a quitar espacios demas
        html = re.sub(r'\s{2,}', ' ', html)

    # Remover posibles estilos de la tabla
        html = re.sub(r'(<(table|tr|td|th)[^>]*?)\s+style="[^"]*"', r'\1', html, flags=re.IGNORECASE)

    # Prettify the HTML using xml.dom.minidom
        try:
        # Parse the HTML string into an XML/HTML DOM object
            dom = xml.dom.minidom.parseString(html)

        # Convert the DOM object back to a string with pretty-print (auto-indentation)
            pretty_html = dom.toprettyxml(indent="  ")  # Indentation level (2 spaces)

        # Step 4: Remove unnecessary line breaks (empty lines) between elements
        # This strips out any line that is empty or contains only whitespace
            pretty_html = "\n".join([line for line in pretty_html.splitlines() if line.strip()])

        except Exception as e:
        # Handle parsing errors, if any occur
            QMessageBox.critical(self, 'Error', f'Failed to prettify HTML: {e}')
            return

    # Step 5: Ask the user where to save the file
        options = QFileDialog.Options()
        options |= QFileDialog.DontUseNativeDialog  # Optional

        filename, _ = QFileDialog.getSaveFileName(
            self,
            "Save HTML File",
            "",
            "HTML Files (*.html);;All Files (*)",
            options=options
         )

    # Step 6: Save the prettified HTML to the file
        if filename:
            try:
                with open(filename, 'w', encoding='utf-8') as file:
                    file.write(pretty_html)
                # Step 7: Show success message
                QMessageBox.information(self, 'Success', f'HTML saved to "{filename}".')
            except Exception as e:
            # Show error message if something goes wrong
                 QMessageBox.critical(self, 'Error', f'An error occurred:\n{e}')
        else:
            # User canceled the save dialog
            QMessageBox.warning(self, 'Cancelled', 'Save operation cancelled.')


if __name__ == '__main__':
    app = QApplication(sys.argv)
    converter = RichTextConverter()
    converter.show()
    sys.exit(app.exec_())

