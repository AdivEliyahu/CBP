module.exports = {
    ci: {
      collect: {
        staticDistDir: './build',
        url: ['http://localhost:3000'],
        numberOfRuns: 3
      },
      assert: {
        assertions: {
          'performance': ['error', {minScore: 0.9}],
          'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
          'largest-contentful-paint': ['warn', {maxNumericValue: 2500}],
          'cumulative-layout-shift': ['warn', {maxNumericValue: 0.1}],
        },
      },
      upload: {
        target: 'filesystem', 
        outputDir: './lhci_reports',
      },
    },
  };
  