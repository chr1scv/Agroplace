import subprocess
import os
import sys
import time

def main():
    # Obtener el directorio actual donde se encuentra este script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Definir rutas a las carpetas del proyecto
    backend_dir = os.path.join(base_dir, 'Django')
    frontend_dir = os.path.join(base_dir, 'frontend')
    
    # Intentar localizar el ejecutable de Python del entorno virtual
    # En Windows la ruta estándar es venv/Scripts/python.exe
    venv_python = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')
    
    if os.path.exists(venv_python):
        python_executable = venv_python
        print(f"[INFO] Usando entorno virtual detectado: {python_executable}")
    else:
        python_executable = sys.executable
        print(f"[INFO] No se detectó entorno virtual en 'Django/venv', usando python del sistema: {python_executable}")

    processes = []

    try:
        print("\n[INFO] Iniciando Backend (Django)...")
        # Iniciamos el servidor de Django
        backend_process = subprocess.Popen(
            [python_executable, 'manage.py', 'runserver'],
            cwd=backend_dir,
            shell=True # shell=True permite ver la salida coloreada en algunas terminales y maneja mejor la ejecución
        )
        processes.append(backend_process)

        print("[INFO] Iniciando Frontend (React)...")
        # Iniciamos el servidor de desarrollo de React
        # 'npm' requiere shell=True en Windows para ser encontrado correctamente
        frontend_process = subprocess.Popen(
            ['npm', 'start'],
            cwd=frontend_dir,
            shell=True
        )
        processes.append(frontend_process)

        print("\n" + "="*50)
        print(" APLICACIÓN INICIADA CORRECTAMENTE")
        print(" Presiona Ctrl+C en esta terminal para detener todo.")
        print("="*50 + "\n")

        # Mantener el script corriendo para vigilar los procesos
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n\n[INFO] Interrupción de usuario detectada. Deteniendo servicios...")
        
        # Intentar detener los procesos ordenadamente
        for p in processes:
            try:
                # En Windows, terminate() con shell=True puede no matar todo el árbol de procesos,
                # pero es el primer intento estándar.
                p.terminate()
            except Exception as e:
                print(f"[ERROR] No se pudo detener un proceso: {e}")
        
        print("[INFO] Servicios detenidos. Hasta luego.")

if __name__ == "__main__":
    main()
