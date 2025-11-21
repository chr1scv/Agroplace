# Admin Panel Verification Checklist

## ✅ Pre-Verification Setup
- [x] Django server running on http://localhost:8000
- [x] ProductoSerializer updated to allow categoria/vendedor writes
- [x] CSRF token handling improved in ProductoCard
- [ ] Frontend dev server running
- [ ] Logged in as admin user

---

## 🧪 Test Cases

### Test 1: Product Creation (CRITICAL)
**Goal**: Verify products can be created without IntegrityError

**Steps**:
1. Navigate to vendor dashboard or product creation form
2. Fill in all required fields:
   - Product name
   - Description
   - Price (> 0)
   - Stock (>= 0)
   - **Category** (select from dropdown)
   - Origin (convencional/organico)
3. Upload an image (optional)
4. Click "Crear Producto" or "Guardar"

**Expected Result**:
- ✅ Product created successfully
- ✅ Success toast: "🎉 Producto creado exitosamente! Ahora debe ser aprobado por un administrador."
- ✅ No IntegrityError about categoria_id
- ✅ No duplicate error toasts

**Actual Result**: _[To be filled during testing]_

---

### Test 2: Product Deletion
**Goal**: Verify products can be deleted without 403 error

**Steps**:
1. Navigate to vendor products list
2. Click delete button on any product
3. Confirm deletion in modal

**Expected Result**:
- ✅ Product deleted successfully
- ✅ Success toast: "✅ Producto eliminado correctamente"
- ✅ No 403 Forbidden error
- ✅ Product removed from list

**Actual Result**: _[To be filled during testing]_

---

### Test 3: Admin Panel - Product Approval
**Goal**: Verify admin can approve pending products

**Steps**:
1. Login as admin
2. Navigate to Admin Panel
3. Go to "Productos Pendientes" section
4. Click "Aprobar" on a pending product

**Expected Result**:
- ✅ Product approved successfully
- ✅ Success toast: "✅ Producto aprobado"
- ✅ Product removed from pending list
- ✅ Product appears in approved products list

**Actual Result**: _[To be filled during testing]_

---

### Test 4: Admin Panel - Product Editing
**Goal**: Verify product status can be changed in edit modal

**Steps**:
1. In Admin Panel, click "Editar" on any product
2. Change product status using the status selector
3. Modify other fields if desired
4. Click "Guardar Cambios"

**Expected Result**:
- ✅ Product updated successfully
- ✅ Status change reflected in product list
- ✅ If changed to "pendiente", product appears in pending list

**Actual Result**: _[To be filled during testing]_

---

### Test 5: Data Display - Vendor & Category
**Goal**: Verify vendor and category names display correctly in tables

**Steps**:
1. Navigate to Admin Panel
2. View products table
3. Check vendor and category columns

**Expected Result**:
- ✅ Vendor username displays correctly
- ✅ Category name displays correctly
- ✅ No "undefined" or empty values

**Actual Result**: _[To be filled during testing]_

---

### Test 6: UI Consistency
**Goal**: Verify admin panel styling matches site design

**Steps**:
1. Navigate through all admin panel sections
2. Check tables, filters, modals

**Expected Result**:
- ✅ Dark background: `rgba(26, 31, 46, 0.95)`
- ✅ Green accents on hover/borders
- ✅ Consistent typography and spacing
- ✅ No white boxes or mismatched colors

**Actual Result**: _[To be filled during testing]_

---

### Test 7: Category Creation & Sync
**Goal**: Verify categories created in admin panel appear in product forms

**Steps**:
1. In Admin Panel, go to Categories section
2. Create a new category (e.g., "Test Category")
3. Navigate to product creation form
4. Check category dropdown

**Expected Result**:
- ✅ New category appears in dropdown
- ✅ Can select and use new category
- ✅ Products created with new category save correctly

**Actual Result**: _[To be filled during testing]_

---

## 📊 Summary

**Total Tests**: 7  
**Passed**: _[To be filled]_  
**Failed**: _[To be filled]_  
**Blocked**: _[To be filled]_

## 🐛 Issues Found During Testing

_[Document any new issues discovered]_

---

## 🔄 Next Steps

After verification:
1. If all tests pass → Mark task as complete
2. If issues found → Document and create fix plan
3. Update walkthrough.md with test results
