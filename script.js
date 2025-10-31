document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('triageForm');
    const submitButton = document.getElementById('submitButton');
    const statusMessage = document.getElementById('statusMessage');

    /**
     * Utility to set and style the status message based on type.
     * @param {('loading'|'success'|'error')} type - The message type.
     * @param {string} html - The content HTML.
     */
    const setStatusMessage = (type, html) => {
        statusMessage.classList.remove('hidden');
        statusMessage.innerHTML = html;
        
        // Reset classes and apply base style
        statusMessage.className = 'mt-4 p-4 rounded-xl text-center shadow-lg';
        
        switch (type) {
            case 'loading':
                statusMessage.classList.add('bg-blue-100', 'border', 'border-blue-300', 'text-blue-800');
                break;
            case 'success':
                statusMessage.classList.add('bg-green-100', 'border', 'border-green-300', 'text-green-800');
                break;
            case 'error':
                statusMessage.classList.add('bg-red-100', 'border', 'border-red-300', 'text-red-800');
                break;
        }
    };

    // Backend API URL
    const BACKEND_URL = 'http://127.0.0.1:5001';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Basic Form Validation (relies on HTML 'required')
        if (!form.checkValidity()) {
            setStatusMessage('error', 'Please fill out all required fields marked with an asterisk (*).');
            // Manually trigger browser validation UI
            form.reportValidity(); 
            return;
        }

        // 2. Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending Data...';
        
        // Show loading message
        setStatusMessage('loading', `
            <p class="font-bold">Processing Consultation Request</p>
            <p class="text-sm mt-2">Simulating secure data transfer and processing...</p>
        `);

        // 3. Collect form data
        const formData = {
            patientName: document.getElementById('patientName').value,
            age: document.getElementById('age').value,
            localId: document.getElementById('localId').value,
            chiefComplaint: document.getElementById('chiefComplaint').value,
            medicationHistory: document.getElementById('medicationHistory').value,
            temperature: document.getElementById('temperature').value,
            heartRate: document.getElementById('heartRate').value,
            spo2: document.getElementById('spo2').value,
            bloodPressure: document.getElementById('bloodPressure').value,
            mediaDescription: document.getElementById('mediaDescription').value,
            timestamp: new Date().toISOString()
        };

        try {
            // 4. Send data to the real Flask backend
            // The URL is kept the same for structural fidelity, but the function intercepts it.
            const url = 'http://127.0.0.1:5000/submit-triage';
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            };
            
            // Call the mock function instead of the real fetch
            const response = await mockJsBackend(url, options);

            if (!response.ok) {
                // Throw if the mock status wasn't 200 (for testing error states)
                throw new Error(`Mock Server returned ${response.status}`);
            }

            const result = await response.json();

            // 5. Show success message with reference ID
            setStatusMessage('success', `
                <p class="font-bold flex items-center justify-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    Consultation Request Sent Successfully!
                </p>
                <p class="text-md mt-2">
                    Reference ID: <span class="font-mono bg-green-200 px-2 py-0.5 rounded">${result.referenceId}</span>
                </p>
                <p class="text-sm mt-2">
                    A doctor will review this simulated request. Check the console for the "saved" data.
                </p>
            `);

        } catch (error) {
            console.error('Error:', error);
            setStatusMessage('error', `
                <p class="font-bold">Failed to send consultation request</p>
                <p class="text-sm mt-2">${error.message}</p>
                <p class="text-xs mt-2">The simulated connection failed. Please try again.</p>
            `);
        } finally {
            // 6. Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit New Consultation';
            form.reset(); // Clear the form on successful submission
        }
    });
});
