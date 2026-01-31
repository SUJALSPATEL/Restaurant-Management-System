        // Menu
        const menuData = {
            Drinks: [
                { id: 1, name: 'Masala Chai', price: 20, emoji: '☕' },
                { id: 2, name: 'Coffee', price: 30, emoji: '☕' },
                { id: 3, name: 'Coca Cola', price: 50, emoji: '🥤' },
                { id: 4, name: 'Pepsi', price: 50, emoji: '🥤' },
                { id: 5, name: 'Fresh Lime Soda', price: 50, emoji: '🍋' },
                { id: 6, name: 'Mango Shake', price: 90, emoji: '🥭' },
                { id: 7, name: 'Oreo Shake', price: 90, emoji: '🧋' },
                { id: 8, name: 'Coconut Juice', price: 70, emoji: '🍸' }
            ],
            Burgers: [
                { id: 9, name: 'Cheeseburger', price: 80, emoji: '🍔' },
                { id: 10, name: 'Chicken Burger', price: 100, emoji: '🍔' },
                { id: 11, name: 'Veg Burger', price: 70, emoji: '🍔' },
                { id: 12, name: 'Double Patty Burger', price: 120, emoji: '🍔' },
                { id: 13, name: 'Paneer Burger', price: 120, emoji: '🍔' },
                { id: 14, name: 'Vadapav', price: 40, emoji: '🍔' },
                { id: 15, name: 'Crispy Aloo Tikki Burger', price: 70, emoji: '🍔' }
            ],
            Snacks: [
                { id: 16, name: 'French Fries', price: 80, emoji: '🍟' },
                { id: 17, name: 'Chicken Wings', price: 150, emoji: '🍗' },
                { id: 18, name: 'Onion Rings', price: 70, emoji: '🧅' },
                { id: 19, name: 'Spring Rolls', price: 90, emoji: '🥟' },
                { id: 20, name: 'Pav-Bhaji', price: 120, emoji: '🍞' },
                { id: 21, name: 'Pizza', price: 150, emoji: '🍕' },
                { id: 22, name: 'Sandwich', price: 100, emoji: '🥪' },
                { id: 23, name: 'Frankie', price: 100, emoji: '🌯' }
            ],
            Meals: [
                { id: 24, name: 'Chicken Biryani', price: 200, emoji: '🍛' },
                { id: 25, name: 'Veg Thali', price: 180, emoji: '🍱' },
                { id: 26, name: 'Pasta Alfredo', price: 220, emoji: '🍝' },
                { id: 27, name: 'Fried Rice Combo', price: 160, emoji: '🍚' }
            ]
        };

        // Varaibles
        let currentCategory = 'Drinks';
        let orderItems = [];
        let calcDisplay = '0';
        let appliedDiscountCode = '';
        let appliedDiscountAmount = 0;

        // Discount Codes
        const discountCodes = {
            'HAPPY100': 100,
            'FAMILY300': 300,
            'SPECIAL500': 500,
            'LARGE2000': 2000
        };

        // initialization
        function init() {
            generateBillNumber();
            renderMenu();
            setupTabs();
            setupKeyboardListeners();
            updateBill();
        }

        // random bill no.
        function generateBillNumber() {
            const billNum = Math.floor(10000 + Math.random() * 90000);
            document.getElementById('billNumber').textContent = billNum;
        }

        // tabs
        function setupTabs() {
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    currentCategory = tab.dataset.category;
                    renderMenu();
                });
            });
        }

        // render menu
        function renderMenu() {
            const menuSection = document.getElementById('menuSection');
            menuSection.innerHTML = '';
            
            menuData[currentCategory].forEach((item, index) => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <div class="item-emoji">${item.emoji}</div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">₹${item.price}</div>
                    </div>
                `;
                menuItem.onclick = () => addToOrder(item);
                menuSection.appendChild(menuItem);
            });
        }

        // adding to order
        function addToOrder(item) {
            const existingItem = orderItems.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                orderItems.push({ ...item, quantity: 1 });
            }
            renderOrder();
            updatePrintItems();
            updateBill();
        }

        // updated print items
        function updatePrintItems() {
            const container = document.getElementById('printItems');
            const customerName = document.getElementById('customerName').value.trim();
            
            // Update name on print
            document.getElementById('printCustomer').innerHTML =
                customerName ? `Customer: ${customerName}` : `Customer: (N/A)`;

        
            container.innerHTML = orderItems.map(i => `
                <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;">
                    <span>${i.name} x ${i.quantity}</span>
                    <span>₹${i.price * i.quantity}</span>
                </div>
            `).join('');
        }


        // render order
        function renderOrder() {
            const orderSection = document.getElementById('orderItems');
            orderSection.innerHTML = '';
            
            orderItems.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div class="order-item-emoji">${item.emoji}</div>
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name} × ${item.quantity}</div>
                        <div class="order-item-price">₹${item.price * item.quantity}</div>
                    </div>
                    <button class="order-item-remove" onclick="removeFromOrder(${item.id})">×</button>
                `;
                orderSection.appendChild(orderItem);
            });
        }

        // remove from order
        function removeFromOrder(itemId) {
            const item = orderItems.find(i => i.id === itemId);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    orderItems = orderItems.filter(i => i.id !== itemId);
                }
            }
            renderOrder();
            updateBill();
        }

        // bill update
        function updateBill() {
            const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.05;
            const serviceCharge = subtotal > 0 ? subtotal * 0.02 : 0;
            const total = subtotal + tax + serviceCharge - appliedDiscountAmount;

            document.getElementById('subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('tax').textContent = tax.toFixed(2);
            document.getElementById('serviceCharge').textContent = serviceCharge.toFixed(2);
            document.getElementById('total').textContent = Math.max(0, total).toFixed(2);

            if (appliedDiscountAmount > 0) {
                document.getElementById('discountRow').style.display = 'flex';
                document.getElementById('discountAmount').textContent = appliedDiscountAmount.toFixed(2);
            } else {
                document.getElementById('discountRow').style.display = 'none';
            }
        }

        // discount textarea
        function toggleDiscount() {
            const area = document.getElementById('discountInputArea');
            area.classList.toggle('show');
        }

        // notes textarea
        function toggleNotes() {
            const area = document.getElementById('notesInputArea');
            area.classList.toggle('show');
        }

        // apply discount
        function applyDiscount() {
            const code = document.getElementById('discountInput').value.toUpperCase();
            if (discountCodes[code]) {
                
            const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                if(subtotal >= 3*discountCodes[code]) {
                    appliedDiscountCode = code;
                    appliedDiscountAmount = discountCodes[code];
                    document.getElementById('discountApplied').textContent = `✓ ${code} applied (-₹${appliedDiscountAmount})`;
                    updateBill();
                }
                else {
                    alert(`Please add items worth ${3*discountCodes[code]-subtotal} more to get ${discountCodes[code]} of Discount.`);
                }
            } else {
                alert('Invalid discount code!');
            }
        }

        // enter shortcut
        document.getElementById('discountInput').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // form submit/block issues avoid
                applyDiscount();
            }
        });


        // Clear Order
        function clearOrder() {
            if (confirm('Are you sure you want to clear the order?')) {
                orderItems = [];
                updatePrintItems();
                appliedDiscountCode = '';
                appliedDiscountAmount = 0;
                document.getElementById('discountInput').value = '';
                document.getElementById('discountApplied').textContent = '';
                document.getElementById('notesTextarea').value = '';
                document.getElementById('customerName').value = '';
                document.getElementById('printCustomer').innerHTML = '';

                renderOrder();
                updateBill();                
                generateUnifiedOrderNumber();


                document.getElementById('printItems').innerHTML = '';
            }
        }

        // bill order ref no.
        function generateOrderRef() {
            const ref = Math.floor(10000 + Math.random() * 90000);
            document.getElementById('orderRef').textContent = ref;
        }   

        // Place Order
        function placeOrder() {
            if (orderItems.length === 0) {
                alert('Please add items to the order!');
                return;
            }
            alert('Order placed successfully!');
        }

        // Calculator Input
        function calcInput(value) {
            if (value === '=') {
                try {
                    calcDisplay = eval(calcDisplay.replace('×', '*').replace('÷', '/')).toString();
                } catch {
                    calcDisplay = 'Error';
                }
            } else if (calcDisplay === '0' || calcDisplay === 'Error') {
                calcDisplay = value;
            } else {
                calcDisplay += value;
            }
            document.getElementById('calcDisplay').textContent = calcDisplay;
        }

        // keyboard shortcuts
        function setupKeyboardListeners() {
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                if (/^[0-9]$/.test(e.key)) {
                    calcInput(e.key);
                } else if (e.key === '.') {
                    calcInput('.');
                } else if (['+', '-', '*', '/'].includes(e.key)) {
                    calcInput(e.key);
                } else if (e.key === 'Enter' || e.key === '=') {
                    e.preventDefault();
                    calcInput('=');
                } else if (e.key.toLowerCase() === 'p') {
                    e.preventDefault();
                    printBill();
                } else if (e.key === 'Backspace') {
                    calcDisplay = calcDisplay.slice(0, -1) || '0';
                    document.getElementById('calcDisplay').textContent = calcDisplay;
                } else if (e.key.toLowerCase() === 'c') {
                    e.preventDefault();
                    checkout();
                }

            });
        }

        //generating randomised order number
        function generateUnifiedOrderNumber() {
            const num = Math.floor(10000 + Math.random() * 90000);
            document.getElementById('orderRef').textContent = num;
            document.getElementById('billNumber').textContent = num;
        }


        // Print Bill
        function printBill() {
            window.print();
        }

        // Checkout
        function checkout() {
            if (orderItems.length === 0) {
                alert('Please add items to checkout!');
                return;
            }
            if (confirm('Complete checkout and print bill?')) {
                printBill();
                setTimeout(() => {
                    clearOrder();
                    generateUnifiedOrderNumber();


                    document.getElementById('printItems').innerHTML = '';
                    document.getElementById('customerName').value = '';
                    document.getElementById('printCustomer').innerHTML = '';

                }, 1000);
            }
        }

        // Initialize on load
        init();