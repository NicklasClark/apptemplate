/*
BOHEMIANGRID OPTIONS
Options for vendor scripts
 */

$(document).ready(function() {
// Start Pull to Refresh
  var myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

  function pullDownAction () {
    setTimeout(function () {  // Simulates loading (remove from production).
      var el, li, i;
      el = document.getElementById('thelist');

      for (i=0; i<1; i++) {
        li = document.createElement('li');
        li.innerText = 'Hey! New Row! ' + (++generatedCount);
        el.insertBefore(li, el.childNodes[0]);
      }

      myScroll.refresh();   // Refresh when contents are loaded (ie: on ajax completion)
    }, 1000); // Simulates loading (remove from production).

  }

  function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;

    myScroll = new iScroll('wrapper', {
      useTransition: true,
      topOffset: pullDownOffset,
      onRefresh: function () {
        if (pullDownEl.className.match('loading')) {
          pullDownEl.className = '';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
        }
      },
      onScrollMove: function () {
        if (this.y > 5 && !pullDownEl.className.match('flip')) {
          pullDownEl.className = 'flip';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
          this.minScrollY = 0;
        } else if (this.y < 5 && pullDownEl.className.match('flip')) {
          pullDownEl.className = '';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
          this.minScrollY = -pullDownOffset;
        }
      },
      onScrollEnd: function () {
        if (pullDownEl.className.match('flip')) {
          pullDownEl.className = 'loading';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
          pullDownAction(); // Execute custom function (ajax call?)
        }
      }
    });

    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
  }

  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

  document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

// End Pull to Refresh

}); // End Document Ready

