#!/usr/bin/env python3
"""
Script 1: Fix duplicate keys in VendedorPanel - Change Date.now() to counter
"""

def fix_vendedor_panel_keys():
    file_path = r'c:\Users\Christopher\OneDrive\Desktop\Agroplace\frontend\src\pages\vendedor\VendedorPanel.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing duplicate keys in VendedorPanel...")
    
    # Add toastIdCounter state
    old_state = "const [toasts, setToasts] = useState([]);"
    new_state = """const [toasts, setToasts] = useState([]);
    const toastIdCounterRef = useRef(0);"""
    
    if old_state in content and "toastIdCounterRef" not in content:
        content = content.replace(old_state, new_state)
        print("✓ Added toastIdCounterRef")
    
    # Add useRef import if not present
    if "useRef" not in content.split('\n')[0]:
        content = content.replace(
            "import React, { useState, useEffect } from 'react';",
            "import React, { useState, useEffect, useRef } from 'react';"
        )
        print("✓ Added useRef import")
    
    # Fix showToast to use counter
    old_toast = """    const showToast = (message, type = 'success', duration = 5000) => {
        const id = Date.now();
        const toast = { id, message, type, duration };
        setToasts(prev => [...prev, toast]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    };"""
    
    new_toast = """    const showToast = (message, type = 'success', duration = 5000) => {
        const id = ++toastIdCounterRef.current;
        const toast = { id, message, type, duration };
        setToasts(prev => [...prev, toast]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    };"""
    
    if old_toast in content:
        content = content.replace(old_toast, new_toast)
        print("✓ Fixed showToast to use counter")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ VendedorPanel keys fixed!")

if __name__ == "__main__":
    try:
        fix_vendedor_panel_keys()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
