/**
 * Charts functionality for Expense Tracker
 * Provides chart rendering without requiring external libraries
 */

class ExpenseCharts {
    constructor() {
        this.colors = [
            '#5e72e4', // Primary
            '#2dce89', // Success
            '#11cdef', // Info
            '#fb6340', // Warning
            '#f5365c', // Danger
            '#8898aa', // Muted
            '#172b4d', // Dark
            '#5603ad', // Purple
            '#8965e0', // Indigo
            '#f3a4b5'  // Pink
        ];
    }

    // Draw pie chart for expenses by category
    drawPieChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        // Title
        if (options.title) {
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#172b4d';
            ctx.textAlign = 'center';
            ctx.fillText(options.title, centerX, 20);
        }
        
        // Calculate total
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        // No data case
        if (total === 0) {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#8898aa';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', centerX, centerY);
            return;
        }
        
        // Draw pie slices
        let startAngle = -Math.PI / 2; // Start from top
        
        data.forEach((item, index) => {
            if (item.value === 0) return;
            
            const sliceAngle = (item.value / total) * (Math.PI * 2);
            const endAngle = startAngle + sliceAngle;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            ctx.fillStyle = item.color || this.colors[index % this.colors.length];
            ctx.fill();
            
            // Calculate label position
            const labelAngle = startAngle + sliceAngle / 2;
            const labelRadius = radius * 0.7;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;
            
            // Draw percentage label if slice is big enough
            if (sliceAngle > 0.2) {
                const percentage = Math.round((item.value / total) * 100);
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${percentage}%`, labelX, labelY);
            }
            
            startAngle = endAngle;
        });
        
        // Draw legend
        if (options.showLegend !== false) {
            const legendX = width - 100;
            const legendY = 40;
            const legendSpacing = 25;
            
            data.forEach((item, index) => {
                if (item.value === 0) return;
                
                const y = legendY + (index * legendSpacing);
                
                // Color box
                ctx.fillStyle = item.color || this.colors[index % this.colors.length];
                ctx.fillRect(legendX - 20, y, 15, 15);
                
                // Label
                ctx.font = '12px Arial';
                ctx.fillStyle = '#172b4d';
                ctx.textAlign = 'start';
                ctx.textBaseline = 'top';
                ctx.fillText(item.label, legendX, y);
                
                // Value
                const valueText = `₹${item.value.toFixed(2)}`;
                ctx.fillText(valueText, legendX, y + 14);
            });
        }
    }
    
    // Draw bar chart for monthly expenses
    drawBarChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        const padding = options.padding || 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Title
        if (options.title) {
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#172b4d';
            ctx.textAlign = 'center';
            ctx.fillText(options.title, width / 2, 20);
        }
        
        // No data case
        if (data.length === 0) {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#8898aa';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }
        
        // Find max value for scaling
        const maxValue = Math.max(...data.map(item => item.value)) * 1.1; // 10% margin
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.strokeStyle = '#e9ecef';
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.strokeStyle = '#e9ecef';
        ctx.stroke();
        
        // Y-axis labels and grid lines
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const y = padding + (chartHeight / ySteps) * i;
            const value = maxValue - (maxValue / ySteps) * i;
            
            // Grid line
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.strokeStyle = '#e9ecef';
            ctx.stroke();
            
            // Label
            ctx.font = '12px Arial';
            ctx.fillStyle = '#8898aa';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(`₹${value.toFixed(0)}`, padding - 5, y);
        }
        
        // X-axis labels and bars
        const barWidth = chartWidth / data.length * 0.7;
        const barSpacing = chartWidth / data.length * 0.3;
        
        data.forEach((item, index) => {
            const x = padding + (chartWidth / data.length) * index + barSpacing;
            const barHeight = (item.value / maxValue) * chartHeight;
            const y = height - padding - barHeight;
            
            // Bar
            ctx.fillStyle = item.color || this.colors[0];
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Label
            ctx.font = '12px Arial';
            ctx.fillStyle = '#8898aa';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(item.label, x + barWidth / 2, height - padding + 5);
            
            // Value on top of bar if enough space
            if (barHeight > 20) {
                ctx.font = 'bold 12px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`₹${item.value.toFixed(0)}`, x + barWidth / 2, y + barHeight / 2);
            }
        });
    }
    
    // Draw line chart for expense trends
    drawLineChart(canvasId, series, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        const padding = options.padding || 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Title
        if (options.title) {
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#172b4d';
            ctx.textAlign = 'center';
            ctx.fillText(options.title, width / 2, 20);
        }
        
        // No data case
        if (series.length === 0 || series.every(s => s.data.length === 0)) {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#8898aa';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }
        
        // Find data range
        let minX = Infinity, maxX = -Infinity;
        let maxY = 0;
        
        series.forEach(s => {
            s.data.forEach(point => {
                minX = Math.min(minX, point.x);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            });
        });
        
        maxY *= 1.1; // Add 10% margin
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.strokeStyle = '#e9ecef';
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.strokeStyle = '#e9ecef';
        ctx.stroke();
        
        // Y-axis labels and grid lines
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const y = padding + (chartHeight / ySteps) * i;
            const value = maxY - (maxY / ySteps) * i;
            
            // Grid line
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.strokeStyle = '#e9ecef';
            ctx.stroke();
            
            // Label
            ctx.font = '12px Arial';
            ctx.fillStyle = '#8898aa';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(`₹${value.toFixed(0)}`, padding - 5, y);
        }
        
        // X-axis labels and grid lines (for dates)
        // Convert dates to numbers for even spacing
        const range = maxX - minX;
        const xSteps = Math.min(6, series[0].data.length);
        
        for (let i = 0; i <= xSteps; i++) {
            const xPos = padding + (chartWidth / xSteps) * i;
            const date = new Date(minX + (range / xSteps) * i);
            
            // Grid line
            ctx.beginPath();
            ctx.moveTo(xPos, padding);
            ctx.lineTo(xPos, height - padding);
            ctx.strokeStyle = '#e9ecef';
            ctx.stroke();
            
            // Label
            ctx.font = '12px Arial';
            ctx.fillStyle = '#8898aa';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), xPos, height - padding + 5);
        }
        
        // Draw lines for each series
        series.forEach((s, seriesIndex) => {
            if (s.data.length < 2) return;
            
            ctx.beginPath();
            
            s.data.forEach((point, i) => {
                const x = padding + ((point.x - minX) / range) * chartWidth;
                const y = height - padding - (point.y / maxY) * chartHeight;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.strokeStyle = s.color || this.colors[seriesIndex % this.colors.length];
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw points
            s.data.forEach(point => {
                const x = padding + ((point.x - minX) / range) * chartWidth;
                const y = height - padding - (point.y / maxY) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = s.color || this.colors[seriesIndex % this.colors.length];
                ctx.fill();
            });
        });
        
        // Draw legend
        if (options.showLegend !== false) {
            const legendX = width - 100;
            const legendY = 40;
            const legendSpacing = 20;
            
            series.forEach((s, index) => {
                const y = legendY + (index * legendSpacing);
                
                // Line
                ctx.beginPath();
                ctx.moveTo(legendX - 20, y + 6);
                ctx.lineTo(legendX - 5, y + 6);
                ctx.strokeStyle = s.color || this.colors[index % this.colors.length];
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Point
                ctx.beginPath();
                ctx.arc(legendX - 12, y + 6, 3, 0, Math.PI * 2);
                ctx.fillStyle = s.color || this.colors[index % this.colors.length];
                ctx.fill();
                
                // Label
                ctx.font = '12px Arial';
                ctx.fillStyle = '#172b4d';
                ctx.textAlign = 'start';
                ctx.textBaseline = 'middle';
                ctx.fillText(s.name, legendX, y + 6);
            });
        }
    }
    
    // Draw progress bar for budget vs spending
    drawProgressBar(elementId, percentage, options = {}) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'progress-bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        
        // Set percentage and color based on value
        bar.style.width = `${Math.min(percentage, 100)}%`;
        
        if (percentage >= 90) {
            bar.classList.add('danger');
        } else if (percentage >= 70) {
            bar.classList.add('warning');
        }
        
        container.appendChild(bar);
        
        // Add text labels if specified
        if (options.showLabel) {
            const textContainer = document.createElement('div');
            textContainer.className = 'progress-text';
            
            const percentageText = document.createElement('span');
            percentageText.textContent = `${percentage.toFixed(0)}%`;
            
            const statusText = document.createElement('span');
            statusText.textContent = percentage >= 100 ? 'overspent' : 'used';
            
            textContainer.appendChild(percentageText);
            textContainer.appendChild(statusText);
            
            element.appendChild(textContainer);
        }
        
        element.appendChild(container);
    }
} 