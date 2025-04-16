document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectFilesBtn = document.getElementById('selectFilesBtn');
    const errorMessage = document.getElementById('errorMessage');
    const results = document.getElementById('results');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const originalDimensions = document.getElementById('originalDimensions');
    const savings = document.getElementById('savings');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let currentCompressedFile = null;
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // File selection
    selectFilesBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length) {
            handleFiles(fileInput.files);
        }
    });
    
    // Download button
    downloadBtn.addEventListener('click', function() {
        if (currentCompressedFile) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(currentCompressedFile);
            a.download = 'compressed_' + currentCompressedFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
    
    // Handle selected files
    function handleFiles(files) {
        errorMessage.textContent = '';
        
        // Validate files
        if (files.length > 20) {
            errorMessage.textContent = 'Maximum 20 files allowed';
            return;
        }
        
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 10 * 1024 * 1024) {
                errorMessage.textContent = 'File size exceeds 10MB limit: ' + files[i].name;
                return;
            }
            
            if (!files[i].type.match('image.*')) {
                errorMessage.textContent = 'Only image files are allowed: ' + files[i].name;
                return;
            }
        }
        
        // Process first file (for demo)
        if (files.length > 0) {
            processFile(files[0]);
        }
    }
    
    // Process and compress image
    async function processFile(file) {
        try {
            // Display original image
            const originalUrl = URL.createObjectURL(file);
            originalImage.src = originalUrl;
            
            // Show original info
            originalSize.textContent = formatFileSize(file.size);
            
            // Get image dimensions
            const img = new Image();
            img.src = originalUrl;
            await img.decode();
            originalDimensions.textContent = `${img.width}×${img.height}`;
            
            // Set up compression options based on file type
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: file.type.match('image/jpeg') ? 'image/jpeg' : 
                         file.type.match('image/webp') ? 'image/webp' : 'image/png'
            };
            
            // Show loading state
            compressedImage.src = '';
            compressedImage.style.backgroundColor = '#f5f5f5';
            compressedSize.textContent = 'Compressing...';
            savings.textContent = '...';
            
            // Compress image
            const compressedFile = await imageCompression(file, options);
            currentCompressedFile = compressedFile;
            
            // Display compressed image
            const compressedUrl = URL.createObjectURL(compressedFile);
            compressedImage.src = compressedUrl;
            compressedImage.style.backgroundColor = 'transparent';
            
            // Show compressed info
            compressedSize.textContent = formatFileSize(compressedFile.size);
            
            // Calculate savings
            const savingsPercent = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
            savings.textContent = `${savingsPercent}%`;
            
            // Show results
            results.style.display = 'block';
            
        } catch (error) {
            console.error('Compression error:', error);
            errorMessage.textContent = 'Error compressing image: ' + error.message;
        }
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
});
