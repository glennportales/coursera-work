import sys
import xml.dom.minidom
import re
from PyQt5.QtWidgets import (QApplication, QWidget, QVBoxLayout, QTextEdit, QLabel, QPushButton, QHBoxLayout, QFileDialog, QMessageBox, QSplitter, QTextBrowser, QCheckBox, QDialog, QFormLayout, QDialogButtonBox)

class RichTextConverter(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('Rich Text to HTML Converter')
        self.resize(800, 600)

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
        convert_button = QPushButton('Convert')
        convert_button.clicked.connect(self.convert_html)
        buttons_layout.addWidget(convert_button)

        # Preview button
        preview_button = QPushButton('Preview HTML')
        preview_button.clicked.connect(self.preview_html)
        buttons_layout.addWidget(preview_button)

        # Save button
        save_button = QPushButton('Save HTML')
        save_button.clicked.connect(self.save_html)
        buttons_layout.addWidget(save_button)

        # Add the buttons layout to the main layout
        layout.addLayout(buttons_layout)

        # HTML Preview field
        self.html_preview = QTextBrowser()
        layout.addWidget(self.html_preview)

        # Set the layout for the main window
        self.setLayout(layout)

        # Initialize attributes for HTML content and tags to remove
        self.cleaned_html = ""
        self.tags_to_remove = ["p", "span", "a"]

    def convert_html(self):
        # Get the HTML content from the QTextEdit
        html = self.text_edit.toHtml()

        # Show the dialog to select tags/attributes to remove
        if self.customize_removal():
            # Step 2: Clean the HTML content based on user selection
            for tag in self.tags_to_remove:
                pattern = rf'</?{tag}(\s+[^>]*)?>'
                html = re.sub(pattern, '', html, flags=re.IGNORECASE)

            # Remove extra spaces
            html = ' '.join(html.split())
            html = re.sub(r'\s{2,}', ' ', html)

            # Remove possible styles from table elements
            html = re.sub(r'(<(table|tr|td|th)[^>]*?)\s+style="[^"]*"', r'\1', html, flags=re.IGNORECASE)

            # Prettify the HTML using xml.dom.minidom
            try:
                dom = xml.dom.minidom.parseString(html)
                pretty_html = dom.toprettyxml(indent="  ")
                self.cleaned_html = "\n".join([line for line in pretty_html.splitlines() if line.strip()])
            except Exception as e:
                QMessageBox.critical(self, 'Error', f'Failed to prettify HTML: {e}')
                return

            # Show success message
            QMessageBox.information(self, 'Success', 'HTML content has been successfully cleaned and converted.')

    def preview_html(self):
        # Display the cleaned HTML in the preview area
        if self.cleaned_html:
            self.html_preview.setPlainText(self.cleaned_html)
        else:
            QMessageBox.warning(self, 'Warning', 'Please convert the HTML first.')

    def save_html(self):
        if not self.cleaned_html:
            QMessageBox.warning(self, 'Warning', 'Please convert and preview the HTML before saving.')
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
                    file.write(self.cleaned_html)
                # Step 7: Show success message
                QMessageBox.information(self, 'Success', f'HTML saved to "{filename}".')
            except Exception as e:
                # Show error message if something goes wrong
                QMessageBox.critical(self, 'Error', f'An error occurred:\n{e}')
        else:
            # User canceled the save dialog
            QMessageBox.warning(self, 'Cancelled', 'Save operation cancelled.')

    def customize_removal(self):
        dialog = QDialog(self)
        dialog.setWindowTitle("Customize HTML Cleaning")
        layout = QFormLayout(dialog)

        # Checkboxes for tags to remove
        self.checkboxes = {}
        for tag in ["p", "span", "a", "div", "b", "i"]:
            checkbox = QCheckBox(tag)
            checkbox.setChecked(tag in self.tags_to_remove)
            self.checkboxes[tag] = checkbox
            layout.addRow(f"Remove <{tag}> tag: ", checkbox)

        # OK and Cancel buttons
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(dialog.accept)
        buttons.rejected.connect(dialog.reject)
        layout.addWidget(buttons)

        if dialog.exec_() == QDialog.Accepted:
            self.tags_to_remove = [tag for tag, checkbox in self.checkboxes.items() if checkbox.isChecked()]
            return True
        return False

if __name__ == '__main__':
    app = QApplication(sys.argv)
    converter = RichTextConverter()
    converter.show()
    sys.exit(app.exec_())
