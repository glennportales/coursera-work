import os
import mammoth
import re
from pdfminer.high_level import extract_text
import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk

def convert_docx_to_html(input_filename, output_filename):
    
    # Open the .docx file in binary mode
    with open(input_filename, "rb") as docx_file:
        # Convert the .docx file to HTML
        result = mammoth.convert_to_html(docx_file)
        html = result.value  # The generated HTML
        messages = result.messages  # Any messages or warnings during conversion

    # **Post-processing the HTML content**

    # 1. Remove <p>, <span>, and <a> tags
    # Define a regex pattern to match the specified tags
    pattern = r'</?(p|span|a)(\s+[^>]*)?>'
    html = re.sub(pattern, '', html, flags=re.IGNORECASE)

    # 2. Remove extra blank spaces and newlines
    html = ' '.join(html.split())

    # 3. (Optional) Remove empty lines or additional cleaning if needed
    # For example, you can remove multiple spaces
    html = re.sub(r'\s{2,}', ' ', html)

    # Write the cleaned HTML to the output file
    with open(output_filename, "w", encoding="utf-8") as html_file:
        html_file.write(html)

def convert_pdf_to_html(input_filename, output_filename):
    # Extract text from PDF
    text = extract_text(input_filename)
    
    # **Post-processing the extracted text**

    # 1. Remove <p>, <span>, and <a> tags (if any)
    pattern = r'</?(p|span|a)(\s+[^>]*)?>'
    text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    # 2. Remove extra blank spaces and newlines
    text = ' '.join(text.split())
    
    # 3. (Optional) Remove multiple spaces
    text = re.sub(r'\s{2,}', ' ', text)
    
    # Simple HTML template
    html_content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Converted PDF</title>
    </head>
    <body>
        {text}
    </body>
    </html>
    """
    
    # Write the cleaned HTML content to a file
    with open(output_filename, 'w', encoding='utf-8') as html_file:
        html_file.write(html_content)

def select_input_file():
    filetypes = (
        ("Word documents", "*.docx"),
        ("PDF files", "*.pdf"),
        ("All files", "*.*")
    )
    filename = filedialog.askopenfilename(
        title="Select Input File",
        filetypes=filetypes
    )
    input_entry.delete(0, tk.END)
    input_entry.insert(0, filename)

def select_output_file():
    filename = filedialog.asksaveasfilename(
        title="Save Output File",
        defaultextension=".html",
        filetypes=(("HTML files", "*.html"),)
    )
    output_entry.delete(0, tk.END)
    output_entry.insert(0, filename)

def convert_file():
    input_filename = input_entry.get()
    output_filename = output_entry.get()

    if not input_filename or not output_filename:
        messagebox.showerror("Error", "Please select both input and output files.")
        return

    if not os.path.isfile(input_filename):
        messagebox.showerror("Error", f"Input file '{input_filename}' does not exist.")
        return

    _, ext = os.path.splitext(input_filename)
    ext = ext.lower()

    try:
        if ext == '.docx':
            convert_docx_to_html(input_filename, output_filename)
            messagebox.showinfo("Success", f"DOCX file converted successfully.\nHTML saved to '{output_filename}'.")
        elif ext == '.pdf':
            convert_pdf_to_html(input_filename, output_filename)
            messagebox.showinfo("Success", f"PDF file converted successfully.\nHTML saved to '{output_filename}'.")
        else:
            messagebox.showerror("Error", "Unsupported file type. Please select a .docx or .pdf file.")
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")

# Create the main application window
root = tk.Tk()
root.title("File to HTML Converter")

# Input file selection
input_label = ttk.Label(root, text="Input File:")
input_label.grid(row=0, column=0, padx=10, pady=10, sticky="e")
input_entry = ttk.Entry(root, width=50)
input_entry.grid(row=0, column=1, padx=10, pady=10)
input_button = ttk.Button(root, text="Browse...", command=select_input_file)
input_button.grid(row=0, column=2, padx=10, pady=10)

# Output file selection
output_label = ttk.Label(root, text="Output HTML File:")
output_label.grid(row=1, column=0, padx=10, pady=10, sticky="e")
output_entry = ttk.Entry(root, width=50)
output_entry.grid(row=1, column=1, padx=10, pady=10)
output_button = ttk.Button(root, text="Browse...", command=select_output_file)
output_button.grid(row=1, column=2, padx=10, pady=10)

# Convert button
convert_button = ttk.Button(root, text="Convert", command=convert_file)
convert_button.grid(row=2, column=1, padx=10, pady=20)

# Start the GUI event loop
root.mainloop()
