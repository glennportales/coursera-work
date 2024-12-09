
document.addEventListener("DOMContentLoaded", function() {
  // Helper function to get direct text content
  function getDirectTextContent(element) {
    var text = '';
    element.childNodes.forEach(function(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue.trim();
      }
    });
    return text;
  }

  // Rest of the code
  var sidenavContainer = document.getElementById('content-sidenav-container');
  var ul = document.getElementById('content-sidenav-list');

  if (!sidenavContainer || !ul) {
    console.error('Sidenav container or list element not found.');
    return;
  }

  var visibleRow = document.querySelector('.region-content');

  if (visibleRow) {
    var mainHeading = visibleRow.querySelector('.sidenav-header');
    if (mainHeading) {
      var mainLi = document.createElement('li');
      mainLi.classList.add('content-sidenav-header-item');
      var mainA = document.createElement('a');
      var mainId = mainHeading.id || 'main-' + Math.random().toString(36).substr(2, 9);
      mainHeading.id = mainId;
      mainA.href = '#' + mainId;
      // Use the helper function here
      mainA.textContent = getDirectTextContent(mainHeading) || 'Main';
      mainA.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById(mainId).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        highlightSection(mainId);
      });
      mainLi.appendChild(mainA);
      ul.appendChild(mainLi);
    }

    var sections = visibleRow.querySelectorAll('.sidenav-section');

    sections.forEach(function(section) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var sectionId = section.id || 'section-' + Math.random().toString(36).substr(2, 9);
      section.id = sectionId;

      // Get the heading inside the section
      var heading = section.querySelector('h3, h2, h4');
      var headingText = heading ? getDirectTextContent(heading) : 'Section';

      a.href = '#' + sectionId;
      a.textContent = headingText;
      a.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById(sectionId).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        highlightSection(sectionId);
      });
      li.appendChild(a);

      // Prepare to collect subsections
      var subUl = null;
      var subsections = section.querySelectorAll('.sidenav-subsection');

      if (subsections.length > 0) {
        subUl = document.createElement('ul');
        subsections.forEach(function(subsection) {
          var subLi = document.createElement('li');
          var subA = document.createElement('a');
          var subSectionId = subsection.id || 'subsection-' + Math.random().toString(36).substr(2, 9);
          subsection.id = subSectionId;
          var subTitleElement = subsection.querySelector('strong') || subsection.querySelector('h4');
          var subTitle = subTitleElement ? getDirectTextContent(subTitleElement) : 'Subsection';
          subA.href = '#' + subSectionId;
          subA.textContent = subTitle;
          subA.addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById(subSectionId).scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            highlightSection(subSectionId);
          });
          subLi.appendChild(subA);
          subUl.appendChild(subLi);
        });
        li.appendChild(subUl);
      }

      ul.appendChild(li);
    });

    function highlightSection(id) {
      // Remove previous highlights
      document.querySelectorAll('.highlighted').forEach(function(el) {
        el.classList.remove('highlighted');
      });
      // Highlight the current section
      var section = document.getElementById(id);
      if (section) {
        section.classList.add('highlighted');
      }
    }
  }
});


document.addEventListener("DOMContentLoaded", function() {
  // Helper function to get direct text content
  function getDirectTextContent(element) {
    var text = '';
    element.childNodes.forEach(function(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue.trim();
      }
    });
    return text;
  }

  // Existing variables
  var sidenavContainer = document.getElementById('content-sidenav-container');
  var ul = document.getElementById('content-sidenav-list');

  // New variable for the mobile combobox
  var mobileSidenav = document.getElementById('mobile-sidenav');

  if (!sidenavContainer || !ul || !mobileSidenav) {
    console.error('Sidenav container, list element, or mobile sidenav not found.');
    return;
  }

  var visibleRow = document.querySelector('.region-content');

  if (visibleRow) {
    // Existing code to populate the desktop sidenav...

    // Code to populate the mobile combobox
    var options = [];

    var sections = visibleRow.querySelectorAll('.sidenav-section');

    sections.forEach(function(section) {
      var sectionId = section.id || 'section-' + Math.random().toString(36).substr(2, 9);
      section.id = sectionId;

      var heading = section.querySelector('h3, h2, h4');
      var headingText = heading ? getDirectTextContent(heading) : 'Section';

      // Add section as an option group or option
      var sectionOption = document.createElement('option');
      sectionOption.value = sectionId;
      sectionOption.textContent = headingText;
      mobileSidenav.appendChild(sectionOption);

      // Collect subsections
      var subsections = section.querySelectorAll('.sidenav-subsection');

      if (subsections.length > 0) {
        subsections.forEach(function(subsection) {
          var subSectionId = subsection.id || 'subsection-' + Math.random().toString(36).substr(2, 9);
          subsection.id = subSectionId;
          var subTitleElement = subsection.querySelector('strong') || subsection.querySelector('h4');
          var subTitle = subTitleElement ? getDirectTextContent(subTitleElement) : 'Subsection';

          // Add subsection as an indented option
          var subOption = document.createElement('option');
          subOption.value = subSectionId;
          subOption.textContent = '— ' + subTitle;
          mobileSidenav.appendChild(subOption);
        });
      }
    });

    // Event listener for the combobox
    mobileSidenav.addEventListener('change', function() {
      var selectedId = this.value;
      if (selectedId) {
        document.getElementById(selectedId).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        highlightSection(selectedId);
      }
    });

    function highlightSection(id) {
      // Remove previous highlights
      document.querySelectorAll('.highlighted').forEach(function(el) {
        el.classList.remove('highlighted');
      });
      // Highlight the current section
      var section = document.getElementById(id);
      if (section) {
        section.classList.add('highlighted');
      }
    }
  }
});
