import os
import json
from pathlib import Path

def get_file_info(file_path):
    """Récupère les informations sur un fichier"""
    stats = os.stat(file_path)
    return {
        "path": str(file_path),
        "size": stats.st_size,
        "is_file": True
    }

def get_dir_info(dir_path):
    """Récupère les informations sur un dossier et son contenu"""
    result = {
        "path": str(dir_path),
        "is_file": False,
        "children": []
    }
    
    try:
        items = os.listdir(dir_path)
        for item in items:
            item_path = os.path.join(dir_path, item)
            # Ignorer les dossiers node_modules et .git
            if item in ['node_modules', '.git', '.next']:
                continue
                
            if os.path.isfile(item_path):
                # Ignorer les fichiers cachés et certaines extensions
                if not item.startswith('.') and not item.endswith(('.pyc', '.pyo')):
                    result["children"].append(get_file_info(item_path))
            else:
                result["children"].append(get_dir_info(item_path))
    except Exception as e:
        print(f"Erreur lors de la lecture du dossier {dir_path}: {e}")
        
    return result

def format_structure_markdown(structure, level=0):
    """Convertit la structure en format Markdown"""
    result = []
    indent = "  " * level
    
    if structure["is_file"]:
        file_name = os.path.basename(structure["path"])
        size = structure["size"]
        size_str = f"{size} bytes" if size < 1024 else f"{size/1024:.1f} KB"
        result.append(f"{indent}- 📄 `{file_name}` ({size_str})")
    else:
        dir_name = os.path.basename(structure["path"])
        result.append(f"{indent}- 📁 **{dir_name}/**")
        for child in sorted(structure["children"], key=lambda x: (x["is_file"], x["path"])):
            result.extend(format_structure_markdown(child, level + 1))
    
    return result

def main():
    # Chemin du projet (un niveau au-dessus du script)
    project_path = Path(__file__).parent.parent.parent
    
    # Récupérer la structure complète
    print("Analyse du projet en cours...")
    structure = get_dir_info(project_path)
    
    # Sauvegarder la structure brute en JSON
    with open(os.path.join(project_path, "doc", "project_structure.json"), "w", encoding="utf-8") as f:
        json.dump(structure, f, indent=2, ensure_ascii=False)
    
    # Générer le Markdown
    markdown_lines = ["# Structure du Projet La Chabroderie\n"]
    markdown_lines.append("## Arborescence Complète\n")
    markdown_lines.extend(format_structure_markdown(structure))
    
    # Sauvegarder le Markdown
    with open(os.path.join(project_path, "doc", "project_structure.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(markdown_lines))
    
    print("Analyse terminée !")
    print("Fichiers générés :")
    print("- doc/project_structure.json")
    print("- doc/project_structure.md")

if __name__ == "__main__":
    main()
