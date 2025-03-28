describe('Structure Creation', () => {
  it('should create nodes and beams', () => {
    cy.get('[data-testid="node-tool"]').dragToCanvas(100, 100);
    cy.get('[data-testid="node-tool"]').dragToCanvas(300, 100);
    cy.get('[data-testid="beam-tool"]').click();
    cy.canvasClick(100, 100); // First node
    cy.canvasClick(300, 100); // Second node
    cy.assertStoreHas('beams', 1);
  });
});
