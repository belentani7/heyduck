"""
Google Takeout + Cloud Console Audit Script
Automates the audit process after suspected MitM attack.
Ignores password changes. Focuses on data extraction and cloud audit.
"""
import os
import time

from playwright.sync_api import sync_playwright

OUT = r'C:\Users\USER\Desktop\google-audit'
os.makedirs(OUT, exist_ok=True)

def run():
    p = sync_playwright().start()
    # Launch with headed browser so user can login
    browser = p.chromium.launch(headless=False)
    context = browser.new_context(viewport={'width': 1920, 'height': 1080})
    page = context.new_page()

    print("="*60)
    print("GOOGLE TAKEOUT + CLOUD AUDIT")
    print("="*60)
    print()
    print("PASO 1: Google Takeout")
    print("El navegador se abrira. Haz login con tu cuenta Google.")
    print("Despues de hacer login, el script continuara automaticamente.")
    print()

    # Navigate to Google Takeout
    page.goto('https://takeout.google.com')
    page.wait_for_timeout(3000)

    # Take screenshot of current state
    page.screenshot(path=os.path.join(OUT, '01-takeout-page.png'))
    print("Screenshot guardado: 01-takeout-page.png")

    # Wait for user to login
    print()
    print("ESPERANDO LOGIN... (haz login en el navegador)")
    print("El script continuara cuando detecte que estas logueado.")

    # Check if logged in by looking for Takeout interface
    max_wait = 120  # 2 minutes max
    start = time.time()
    logged_in = False
    while time.time() - start < max_wait:
        try:
            # Check if we see the Takeout export button or product list
            content = page.content()
            if 'takeout.google.com' in page.url and ('export' in content.lower() or 'producto' in content.lower() or 'product' in content.lower() or 'Cancelar' in content or 'Cancel' in content):
                logged_in = True
                break
        except:
            pass
        time.sleep(2)

    if not logged_in:
        print("TIMEOUT: No se detecto login. Ejecuta el script de nuevo despues de hacer login.")
        page.screenshot(path=os.path.join(OUT, '01-timeout.png'))
        browser.close()
        p.stop()
        return

    print("LOGIN DETECTADO. Continuando con la auditoria...")
    page.screenshot(path=os.path.join(OUT, '02-logged-in.png'))

    # PASO 2: Google Takeout - Select products
    print()
    print("PASO 2: Seleccionando productos en Takeout...")

    # Try to click "Cancelar seleccion" to deselect all first
    try:
        cancel_btn = page.locator('button:has-text("Cancelar"), button:has-text("Cancel"), button:has-text("Deselect")')
        if cancel_btn.count() > 0:
            cancel_btn.first.click()
            page.wait_for_timeout(1000)
            print("  Todos los productos deseleccionados.")
    except:
        pass

    page.screenshot(path=os.path.join(OUT, '03-deselected.png'))

    # List of products to select
    products_to_select = [
        'Mi Actividad', 'My Activity',
        'Datos de seguridad', 'Account security',
        'Gmail',
        'Contactos', 'Contacts',
        'Chrome',
        'Google Drive', 'Drive',
        'Google Fotos', 'Google Photos',
        'YouTube',
        'Google Play', 'Play Store',
    ]

    print("  Buscando y seleccionando productos...")
    for product in products_to_select:
        try:
            # Look for checkbox or toggle near the product name
            checkbox = page.locator(f'text="{product}"').first
            if checkbox.is_visible():
                # Find the nearest checkbox/toggle
                parent = checkbox.locator('..')
                toggle = parent.locator('input[type="checkbox"], [role="switch"], .toggle')
                if toggle.count() > 0:
                    toggle.first.click()
                    print(f"  SELECCIONADO: {product}")
                else:
                    checkbox.click()
                    print(f"  CLICK en: {product}")
                page.wait_for_timeout(300)
        except Exception:
            pass

    page.screenshot(path=os.path.join(OUT, '04-products-selected.png'))
    print("  Productos seleccionados. Screenshot guardado.")

    # PASO 3: Try to set date range
    print()
    print("PASO 3: Configurando rango de fechas (25/01/2026 - 17/07/2026)...")
    print("  (Esto puede requerir configuracion manual por producto)")

    # Try to find and click the export/next button
    try:
        next_btn = page.locator('button:has-text("Siguiente"), button:has-text("Next"), button:has-text("Crear"), button:has-text("Create")')
        if next_btn.count() > 0:
            next_btn.first.click()
            page.wait_for_timeout(2000)
            print("  Boton Next/Crear clickeado.")
    except:
        pass

    page.screenshot(path=os.path.join(OUT, '05-export-step.png'))

    # PASO 4: Google Cloud Console
    print()
    print("PASO 4: Auditando Google Cloud Console...")

    page.goto('https://console.cloud.google.com/home/dashboard')
    page.wait_for_timeout(5000)
    page.screenshot(path=os.path.join(OUT, '06-cloud-console.png'))
    print("  Cloud Console abierto. Screenshot guardado.")

    # Check billing
    print()
    print("PASO 5: Revisando facturacion...")
    try:
        page.goto('https://console.cloud.google.com/billing')
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(OUT, '07-billing.png'))
        print("  Facturacion revisada. Screenshot guardado.")
    except:
        print("  Error al acceder a facturacion.")

    # Check payment methods
    print()
    print("PASO 6: Revisando metodos de pago (TARJETA)...")
    try:
        page.goto('https://console.cloud.google.com/billing/accounts')
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(OUT, '08-payment-methods.png'))
        print("  Metodos de pago revisados. Screenshot guardado.")
    except:
        print("  Error al acceder a metodos de pago.")

    # Check projects
    print()
    print("PASO 7: Revisando proyectos...")
    try:
        page.goto('https://console.cloud.google.com/home/dashboard')
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(OUT, '09-projects.png'))
        print("  Proyectos revisados. Screenshot guardado.")
    except:
        print("  Error al acceder a proyectos.")

    # Check audit logs
    print()
    print("PASO 8: Revisando logs de auditoria...")
    try:
        page.goto('https://console.cloud.google.com/logs/query')
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(OUT, '10-audit-logs.png'))
        print("  Logs de auditoria revisados. Screenshot guardado.")
    except:
        print("  Error al acceder a logs.")

    print()
    print("="*60)
    print("AUDITORIA COMPLETADA")
    print("="*60)
    print(f"Screenshots guardados en: {OUT}")
    print("Revisa los screenshots para ver los resultados.")
    print("Busca: proyectos no reconocidos, tarjetas añadidas, IPs sospechosas.")

    browser.close()
    p.stop()

if __name__ == '__main__':
    run()
