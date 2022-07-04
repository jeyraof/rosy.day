// 특정 DOM 의 절대 위치 정보를 조회한다.
function getAbsolutePosition(elem) {
  var r = elem.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    bottom: r.bottom + window.scrollY
  }
}

// 특정 DOM 의 Top 을 조회한다.
function getAbsoluteTop(elem) {
  return getAbsolutePosition(elem).top
}

(function() {
  var $pgHolder = document.getElementById("playground-holder");
  var $pg = document.getElementById("playground");
  var $storyEach = document.getElementById("story-each");
  var $storyTogether = document.getElementById("story-together");

  var $jyThumb = document.getElementById("jaeyoung-thumb");
  var $jyIcon = $jyThumb.children[0];
  var $jyContents = Array.from(document.getElementsByClassName("content jaeyoung"));
  var $syThumb = document.getElementById("soyoung-thumb");
  var $syIcon = $syThumb.children[0];
  var $syContents = Array.from(document.getElementsByClassName("content soyoung"));
  var $togetherContent = document.getElementsByClassName("content together")[0];

  var jyIconHolders = ['baby', 'boy', 'man', 'couple'];
  var syIconHolders = ['baby', 'girl', 'woman', 'couple'];

  // 동적으로 Dom 의 사이즈가 변경될 수 도 있으니 (이미지 로딩 등),
  // 그냥 매번 계산한다. 현대의 브라우져를 구동하는 단말기들은 생각보다 강력하다.
  function updatePlayground(e) {
    // Playground Holder 의 위치를 정의
    var pgHolderPosition = getAbsolutePosition($pgHolder);

    // Story 의 영역을 결정하는 위치가 story 영역 안쪽에 있을 때 Placeholder 노출을 결정
    var storyEachToken = "on-story-each";
    var storyEachDecider = window.innerHeight + window.scrollY;
    var storyEachPosition = getAbsolutePosition($storyEach);
    if (storyEachDecider > storyEachPosition.top + 1 && storyEachDecider <= pgHolderPosition.bottom) {
      $pg.classList.add(storyEachToken);
    } else {
      $pg.classList.remove(storyEachToken);
    }

    var togetherContentTop = getAbsoluteTop($togetherContent);

    var jyTops = $jyContents.map(getAbsoluteTop);
    var jyLevel = jyTops.findLastIndex(function(value) { return value < storyEachDecider; });
    $jyIcon.classList.remove(...jyIconHolders);
    if (jyLevel < 0) {
      $jyThumb.style.display = "none";
      $jyThumb.style.left = 0;
      $jyThumb.style.transform = "none";
      $jyIcon.classList.add(jyIconHolders[0]);
    } else if (storyEachDecider >= togetherContentTop) {
      $syThumb.style.display = "block";
      $jyThumb.style.left = "50%";
      $jyThumb.style.transform = "translateX(-50%)";
      $jyIcon.classList.add(jyIconHolders[jyIconHolders.length - 1]);
    } else {
      $jyThumb.style.display = "block";
      $jyThumb.style.left = jyLevel / (jyTops.length * 2) * 100 + "%";
      $jyThumb.style.transform = "none";
      $jyIcon.classList.add(jyIconHolders[jyLevel]);
    }

    var syTops = $syContents.map(getAbsoluteTop);
    var syLevel = syTops.findLastIndex(function(value) { return value < storyEachDecider; });
    $syIcon.classList.remove(...syIconHolders);
    if (syLevel < 0) {
      $syThumb.style.display = "none";
      $syThumb.style.right = 0;
      $syThumb.style.transform = "none";
      $syIcon.classList.add(syIconHolders[0]);
    } else if (storyEachDecider >= togetherContentTop) {
      $syThumb.style.display = "block";
      $syThumb.style.right = "50%";
      $syThumb.style.transform = "translateX(50%)";
      $syIcon.classList.add(syIconHolders[syIconHolders.length - 1]);
    } else {
      $syThumb.style.display = "block";
      $syThumb.style.right = syLevel / (syTops.length * 2) * 100 + "%";
      $syThumb.style.transform = "none";
      $syIcon.classList.add(syIconHolders[syLevel]);
    }

  }


  var $photosetRows = Array.from(document.getElementsByClassName("photoset-row"));
  var photoMargin = 2;
  function resizeImages(e) {
    var wholeWidth = document.body.clientWidth;
    $photosetRows.forEach(function($row) {
      var n = $row.children.length,
          exactWidth = wholeWidth - (n - 1) * 2 * photoMargin,
          $images = [],
          totalRatio = 0;

      Array.from($row.children).forEach(function($figure) {
        var image = $figure.children[0].children[0];
        totalRatio += parseFloat(image.getAttribute("data-ratio"));
        $images.push(image);
      });

      $images.forEach(function($image) {
        var ratio = parseFloat($image.getAttribute("data-ratio"));
        var width = exactWidth * ratio / totalRatio;
        console.log(width);
        $image.width = width;
        $image.height = width / ratio;
        $image.src = $image.getAttribute("data-src");
      });
    });
  }

  var throttler;
  function throttle(e, func) {
    if (!throttler) {
      throttler = setTimeout(function() {
        throttler = null;
        func(e)
      }, 66) // 15fps
    }
  }

  document.addEventListener("scroll", function(e) {
    throttle(e, updatePlayground);
  });

  window.addEventListener("resize", function(e) {
    throttle(e, function(e2) {
      resizeImages(e2);
      updatePlayground(e2);
    });
  });

  document.addEventListener("DOMContentLoaded", function(e) {
    throttle(e, function(e2) {
      resizeImages(e2);
      updatePlayground(e2);
    });
  });
}).call(this);
