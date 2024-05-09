// Function to check if a layer is visible
function isLayerVisible(layer) {
  if (layer.visible !== undefined) {
    return layer.visible;
  } else {
    return true; // Default to true if visibility property is undefined
  }
}

// Function to export a layer group (folder) as an SVG file
function exportLayerGroupAsSVG(layerGroup, exportFolder, doc) {
  var combinedSVGContent = '<?xml version="1.0" encoding="utf-8"?>\n';
  combinedSVGContent += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + doc.artboards[0].artboardRect.join(' ') + '">\n';

  // Iterate through the contents of the layer group and add their SVG content to the combined SVG
  for (var i = 0; i < layerGroup.pageItems.length; i++) {
    var subLayer = layerGroup.pageItems[i];
    if (subLayer.typename === "PathItem" && isLayerVisible(subLayer)) {
      combinedSVGContent += '<path d="' + getPathData(subLayer) + '"/>\n';
    }
  }

  combinedSVGContent += '</svg>';

  // Export the combined SVG content to a file
  var exportFile = new File(exportFolder + "/" + layerGroup.name + ".svg");
  exportFile.open("w");
  exportFile.write(combinedSVGContent);
  exportFile.close();
}

// Function to get SVG path data from a PathItem
// Function to get SVG path data from a PathItem
function getPathData(pathItem) {
  var pathData = '';
  for (var i = 0; i < pathItem.pathPoints.length; i++) {
    var point = pathItem.pathPoints[i];
    if (i === 0) {
      pathData += 'M' + point.anchor[0] + ',' + point.anchor[1];
    } else {
      var prevPoint = pathItem.pathPoints[i - 1];
      if (point.pointType === PointType.CORNER && prevPoint.pointType === PointType.CORNER) {
        pathData += 'M' + point.anchor[0] + ',' + point.anchor[1];
      } else {
        pathData += 'L' + point.anchor[0] + ',' + point.anchor[1];
      }
    }
  }
  return pathData;
}


// Main function to detect visible layers and export layer groups
function main() {
  var scriptFile = File($.fileName)
  var scriptFolder = scriptFile.parent;
  var doc = app.activeDocument;
  var rootItems = doc.pageItems;
  for (var i = 0; i < rootItems.length; i++) {
    var rootItem = rootItems[i];
    if (rootItem.typename === "GroupItem" && isLayerVisible(rootItem)) {
      // If it's a layer group (folder), create a new folder for it and export its contents
      var exportFolder = scriptFolder.path + '/' + rootItem.name; 
      var newFolder = new Folder(exportFolder);
      newFolder.create();
      
      // Export the layer group as an SVG file
      exportLayerGroupAsSVG(rootItem, exportFolder, doc);
    } else if (rootItem.typename === "PathItem" && isLayerVisible(rootItem)) {
      // If it's a path item (layer), export it as an SVG file
      var exportFolder = scriptfolder.path; 
      var exportFile = new File(exportFolder + "/" + rootItem.name + ".svg");
      var combinedSVGContent = '<?xml version="1.0" encoding="utf-8"?>\n';
      combinedSVGContent += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + doc.artboards[0].artboardRect.join(' ') + '">\n';
      combinedSVGContent += '<path d="' + getPathData(rootItem) + '"/>\n';
      combinedSVGContent += '</svg>';
      exportFile.open("w");
      exportFile.write(combinedSVGContent);
      exportFile.close();
    }
  }
  alert("exporting to - " + scriptFolder + "/")
}

// Call the main function
main();












// // Function to export layers within a folder
// function exportLayersInFolder(folder) {
//   for (var i = 0; i < folder.layers.length; i++) {
//     var layer = folder.layers[i];
//     if (layer.visible && layer.layers.length > 0) {
//       var newGroup = folder.groupItems.add();
//       newGroup.name = layer.name;
//       exportLayersInFolder(layer);
//     } else if (layer.visible) {
//       var exportOptions = new ExportOptionsPNG24();
//       var exportFile = new File("C:/Users/Mandar/Desktop/StudyCrafter/Exporttest2/" + layer.name + ".png");
//       app.activeDocument.exportFile(exportFile, ExportType.PNG24, exportOptions);
//     }
//   }
// }

// // Main function to detect visible layer and export sub layers
// function main() {
//   var layers = app.activeDocument.layers;
//   for (var i = 0; i < layers.length; i++) {
//     var layer = layers[i];
//     if (layer.visible && layer.layers.length > 0) {
//       var newGroup = app.activeDocument.groupItems.add();
//       newGroup.name = layer.name;
//       exportLayersInFolder(layer);
//     } else if (layer.visible) {
//       var exportOptions = new ExportOptionsPNG24();
//       var exportFile = new File("C:/Users/Mandar/Desktop/StudyCrafter/Exporttest2/" + layer.name + ".png");
//       app.activeDocument.exportFile(exportFile, ExportType.PNG24, exportOptions);
//     }
//   }
// }

// // Call the main function
// main();
