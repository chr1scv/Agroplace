import requests

try:
    r = requests.get('http://localhost:8000/api/usuarios/?estado=pendiente&tipo_usuario=vendedor')
    print(f'Status: {r.status_code}')
    
    if r.status_code == 200:
        data = r.json()
        print(f'\n✅ Vendedores pendientes: {len(data)}')
        for v in data:
            print(f'  - {v["username"]} (estado: {v["estado"]}, active: {v["is_active"]})')
    else:
        print(f'❌ Error: {r.status_code}')
        print(r.text)
except Exception as e:
    print(f'❌ Error: {e}')
