(function() {
  // Prevent multiple script injections
  if (window.filterXInjected) return;
  window.filterXInjected = true;

  // Function to get the actual text content of a tweet
  function getTweetText(container) {
    let text = '';

    // Get main tweet text
    const tweetText = container.querySelector('[data-testid="tweetText"]');
    if (tweetText) {
      text += tweetText.textContent || '';
    }

    // Get social context (retweets, etc)
    const socialContext = container.querySelector('[data-testid="socialContext"]');
    if (socialContext) {
      text += ' ' + (socialContext.textContent || '');
    }

    return text.toLowerCase();
  }

  // Function to filter tweets
  function filterTweets() {
    chrome.storage.sync.get('filterPhrases', (data) => {
      // Get all filter phrases (no defaults, only user-added)
      const filterPhrases = data.filterPhrases || [];

      // Find all tweets
      const tweetContainers = document.querySelectorAll([
        'article[role="article"]',
        '[data-testid="tweet"]',
        '[data-testid="cellInnerDiv"]'
      ].join(','));

      tweetContainers.forEach(container => {
        // Skip if already processed
        if (container.hasAttribute('data-filterx-processed')) {
          return;
        }

        // Mark as processed
        container.setAttribute('data-filterx-processed', 'true');

        // Get the tweet text
        const tweetText = getTweetText(container);
        
        // Check if tweet contains any filtered phrases
        const shouldHide = filterPhrases.some(phrase => 
          tweetText.includes(phrase.toLowerCase())
        );

        if (shouldHide) {
          // Hide the tweet
          const article = container.closest('article[role="article"]') || 
                         container.closest('[data-testid="tweet"]') || 
                         container.closest('[data-testid="cellInnerDiv"]');
          
          if (article) {
            article.style.display = 'none';
          }
        }
      });
    });
  }

  // Create a mutation observer to watch for new tweets
  const observer = new MutationObserver((mutations) => {
    let shouldFilter = false;

    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        // Check if any of the added nodes are or contain tweets
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && // Element node
              (node.querySelector('article[role="article"]') ||
               node.querySelector('[data-testid="tweet"]') ||
               node.querySelector('[data-testid="cellInnerDiv"]') ||
               node.matches('article[role="article"]') ||
               node.matches('[data-testid="tweet"]') ||
               node.matches('[data-testid="cellInnerDiv"]'))) {
            shouldFilter = true;
          }
        });
      }
    });

    if (shouldFilter) {
      filterTweets();
    }
  });

  // Initialize filtering
  function initialize() {
    // Initial filter
    filterTweets();

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Listen for filter updates from popup
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync' && changes.filterPhrases) {
        // Clear processed flags to recheck all tweets
        document.querySelectorAll('[data-filterx-processed]').forEach(el => {
          el.removeAttribute('data-filterx-processed');
        });
        filterTweets();
      }
    });

    // Recheck periodically for missed tweets
    setInterval(filterTweets, 2000);
  }

  // Start if we're on Twitter/X
  if (window.location.hostname.includes('twitter.com') || 
      window.location.hostname.includes('x.com')) {
    
    // Wait for page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  }
})();